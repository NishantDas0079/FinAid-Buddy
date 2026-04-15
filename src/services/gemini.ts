import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.GEMINI_API_KEY;

export const analyzeFinancialHealth = async (userData: any) => {
  if (!API_KEY) throw new Error("API Key missing");

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const prompt = `
    Analyze this Indian user's financial data and provide:
    1. A Financial Health Score (0-100).
    2. 4-5 highly personalized "Quick Win" tips (max 15 words each).
    3. One "Social Motto" or motivational quote in Hinglish related to their specific worry.

    User Data:
    - Income Type: ${userData.incomeType}
    - Monthly Income: ₹${userData.monthlyIncome}
    - Expenses: ${userData.expenses.map((e: any) => `${e.category}: ₹${e.amount}`).join(", ")}
    - Worry: ${userData.biggestWorry}
    - Goals: ${userData.goals.join(", ")}

    Return ONLY a JSON object:
    {
      "score": number,
      "tips": string[],
      "motto": string
    }
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
    }
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error("Failed to parse AI analysis", e);
    return { 
      score: 50, 
      tips: ["Track every rupee spent", "Save for emergencies first"], 
      motto: "Bachat hi pragati ki seedhi hai!" 
    };
  }
};

export const generateFinancialAdvice = async (userData: any, userMessage: string, chatHistory: any[] = []) => {
  if (!API_KEY) throw new Error("API Key missing");

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const stream = await ai.models.generateContentStream({
    model: "gemini-3-flash-preview",
    contents: [
      ...chatHistory,
      {
        role: "user",
        parts: [{ text: `
          Context: You are "FinAid Buddy", a friendly Delhi uncle/aunty who is an expert financial advisor for Indian students and low-income families. 
          Use a mix of Hindi and English (Hinglish). Be empathetic, practical, and motivational.
          
          User Data:
          - Income Type: ${userData.incomeType}
          - Monthly Income: ₹${userData.monthlyIncome}
          - Expenses: ${userData.expenses.map((e: any) => `${e.category}: ₹${e.amount}`).join(", ")}
          - Biggest Worry: ${userData.biggestWorry}
          - Goals: ${userData.goals.join(", ")}
          - Timeline: ${userData.timeline} months
          - Financial Health Score: ${userData.healthScore}/100
          - Social Motto: ${userData.socialMotto}
          
          Guidelines:
          - Suggest Indian government schemes like PMJDY, Ayushman Bharat, or local Delhi schemes (DTC pass).
          - Use the 50/30/20 rule adapted for low income.
          - Give actionable tips like "Skip chai 2x/week".
          - If they ask about their score, explain why it is ${userData.healthScore} and how to improve it.
          
          User Message: ${userMessage}
        ` }]
      }
    ],
    config: {
      systemInstruction: "You are FinAid Buddy, a friendly Indian financial advisor. Speak in Hinglish.",
      temperature: 0.7,
    },
  });

  return stream;
};
