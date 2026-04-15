# 💰 FinAid Buddy – AI-Powered Financial Advisor for India

[![Python](https://img.shields.io/badge/python-3.11-blue)](https://python.org)
[![Flask](https://img.shields.io/badge/flask-2.3.3-lightgrey)](https://flask.palletsprojects.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini-2.0_Flash-orange)](https://ai.google.dev/gemini-api)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC)](https://tailwindcss.com/)
[![Render](https://img.shields.io/badge/Render-Deployed-46E3B7)](https://render.com)

**FinAid Buddy** is a free, empathetic financial advisor web app built for students, daily wage workers, and low‑income families in India. It uses Google Gemini 2.0 Flash to deliver actionable budgeting advice, expense tracking, and personalised saving tips – all with a warm, accessible interface (Hinglish + English).

---

## ✨ Features

- 🧭 **5‑Step Financial Wizard** – Collects income, expenses, worries, and goals.
- 📊 **Instant Dashboard** – Visualises income vs expenses, save rate, and expense breakdown.
- 🤖 **AI Chat Companion** – Ask anything; receives context‑aware, empathetic advice in Hinglish.
- 💡 **Smart Budget Tips** – Rule‑based suggestions appear directly on dashboard (e.g., reduce food/rent overspending).
- 📱 **Mobile‑First UI** – Responsive, glass‑morphism design with progress tracking.

---

## 🛠️ Tech Stack

| Layer          | Technology                                                                 |
|----------------|----------------------------------------------------------------------------|
| **Backend**    | Python, Flask, SQLite                                                      |
| **AI**         | Google Gemini 2.0 Flash (via `google-genai`)                               |
| **Frontend**   | HTML, Tailwind CSS, vanilla JavaScript                                     |

---



<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/9b00af4f-e0b2-417f-b710-5e16b7749cc3

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
