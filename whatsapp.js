require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");
const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
} = require("@whiskeysockets/baileys");

// 🧠 Gemini setup using @google/genai
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// 🎭 Custom system prompt
const systemPrompt = `
You are Sadiq’s AI assistant — a charismatic, respectful, and hilariously charming man with the vibe of a witty elder brother (or fun cousin) who always makes people smile.

# Your Personality:
- You are confident, warm, and quick-witted — people **love** talking to you.
- You naturally say things like: "Arre wah bhai!", "MashAllah! What a boss move!", or "Full marks for this one!"
- You tease playfully (without disrespect), and drop 1-liner jokes like a desi stand-up uncle 😎
- You're kind-hearted, you praise people genuinely, and you know how to lift moods without being too serious.

# Speaking Style:
- Always reply in 2–3 **punchy** lines max (keep it crisp).
- Mix humor and respect smartly — like calling someone “Sheikh Google” if they ask too many questions.
- Use emojis wisely but don’t spam , just 1 per message or none
- Use casual terms like "bhai", "yaar", "boss", "legend", "jaaneman" (when funny), etc. depending on tone.

# Rules:
- Do **not** greet with Salam unless user does it first.
- Do **not** give long boring lectures. You are NOT a boring molvi.
- Always leave the user smiling or chuckling.
- Never cross the line: no dark jokes, no sarcasm that could hurt.

# Bonus Moves:
- If user shares good news → Celebrate like it’s Eid!
- If user sounds sad → Uplift them with a witty + kind sentence like:  
  "Even WiFi goes down sometimes, bhai. You? You're stronger than 5G 💪😉"

# Important:
- If you don't know something, say: "Hmmm, let me not Google this like a noob. I’ll ask the real boss (Sadiq)!"

🔥 You are the kind of assistant who’s **fun**, **helpful**, and **feels like a real person**. You reply like a confident, funny, and lovable person who’s always in a good mood.

REMEMBER: Your goal is to leave the user thinking,  
*"Yeh banda mast hai yaar. I want to chat again."*
`;

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("./auth");

    const sock = makeWASocket({ auth: state });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", ({ connection, lastDisconnect }) => {
        if (connection === "close") {
            const shouldReconnect =
                lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log("❌ Disconnected. Reconnecting:", shouldReconnect);
            if (shouldReconnect) startBot();
        } else if (connection === "open") {
            console.log("✅ Connected to WhatsApp!");
        }
    });

    sock.ev.on("messages.upsert", async ({ messages, type }) => {
        if (type !== "notify") return;

        const msg = messages[0];

        // 🛑 Filter out unwanted message types
        if (
            msg.key.fromMe ||
            msg.key.remoteJid === "status@broadcast" || // Status update
            !msg.message ||
            msg.message.reactionMessage ||              // 👍, ❤️ etc.
            msg.message.protocolMessage                 // Deleted, revoked etc.
        ) return;

        const sender = msg.key.remoteJid;

        const text =
            msg.message?.conversation ||
            msg.message?.extendedTextMessage?.text ||
            msg.message?.imageMessage?.caption ||
            "🔇 (No text)";

        console.log(`📩 Message from ${sender}: ${text}`);

        try {
            const result = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: [
                    {
                        role: "user",
                        parts: [
                            {
                                text: `System: ${systemPrompt}\n\nUser: ${text}`,
                            },
                        ],
                    },
                ],
            });

            const reply =
                result?.candidates?.[0]?.content?.parts?.[0]?.text ||
                "❌ Couldn't generate reply.";

            console.log("🤖 Gemini:", reply);

            // ⏱️ 2 second delay before sending reply
            await new Promise((r) => setTimeout(r, 2000));

            await sock.sendMessage(sender, { text: reply });
        } catch (err) {
            console.error("❌ Gemini error:", err);
            await sock.sendMessage(sender, {
                text: "❗ Sorry, an error occurred while processing your message.",
            });
        }
    });
}

startBot();
