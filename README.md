# 🤖 WhatsApp Gemini AI Bot (My Assistant)

This is a Node.js-based **WhatsApp chatbot** that connects Google Gemini (Generative AI) to your WhatsApp using the powerful **Baileys** library.  
The bot replies like a real, funny, respectful person — perfect for projects like tour assistants, personal helpers, or fun chatbots!

---

## 📌 Features

- 🔗 Connects directly to your WhatsApp using **Baileys**
- 🤝 Integrated with **Google Gemini 2.5 Flash model**
- 😎 Chatbot replies like a charming, funny, desi elder brother
- 💬 Auto-replies to messages on WhatsApp
- 🧠 Supports rich system prompts (you control the vibe!)
- 💡 Easy setup with `.env` and no frontend needed
- You can change the system prompt , based on your taste , and it will respond that way , in whatsapp.js file.

---

## ⚙️ Technologies Used

| Feature       | Tech                        |
|--------------|-----------------------------|
| Bot Language  | Node.js                     |
| WhatsApp API  | [`@whiskeysockets/baileys`](https://github.com/WhiskeySockets/Baileys) |
| AI Model      | [`@google/genai`](https://www.npmjs.com/package/@google/genai) |
| Environment   | `dotenv`                    |

---

## 🚀 Setup Guide

### 1. 📁 Clone this Repository

```bash
git clone https://github.com/your-username/whatsapp-gemini-bot.git
cd whatsapp-gemini-bot
npm i 

---
``` 

## 2️⃣ 🔑 Get Your Free Gemini API Key

> 💡 It's free! Just search on Google: **"Gemini API key Google AI Studio"**

### 🪜 Steps:

1. Visit [Gemini API key ](https://ai.google.dev/gemini-api/docs) 
2. Sign in with your Google account
3. Create a new **project**
4. Go to `API Keys` > **Create API Key**
5. Copy the key ✅

---

## ▶️ Start the Bot

```bash
node whatsapp.js

``` 



## Security Notice

⚠️ Never push the auth/ folder to GitHub — it contains sensitive session data.

Add this to .gitignore:

auth/   (this folder will generate as y run the node whatapp.js/main file , this contain sensitive info about the whats app and other info which is used to connect to it )



