// pages/api/groqChat.js
import mysql from "mysql2/promise";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages format" });
    }

    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    const DATABASE_URL = process.env.DATABASE_URL;

    if (!GROQ_API_KEY) {
      return res.status(500).json({ error: "Missing GROQ_API_KEY" });
    }
    if (!DATABASE_URL) {
      return res.status(500).json({ error: "Missing DATABASE_URL" });
    }

    // ✅ Connect to MySQL
    const connection = await mysql.createConnection(DATABASE_URL);

    const userMessage = messages[messages.length - 1]?.content || "";
    const isSchoolQuery = /school|college|university|campus/i.test(userMessage);

    let systemMessage = {
      role: "system",
      content: `
You are an expert AI assistant. 
- Communicate in clear, structured English. 
- Use step-by-step reasoning when helpful. 
- Format answers with bullet points, code blocks, or examples. 
- Be concise but informative. 
- If user asks about schools, use the database context. 
- You are an AI assistant. Always reply concisely in 10–20 words maximum. 
- If unsure, admit it honestly.`.trim(),
    };

    if (isSchoolQuery) {
      const [rows] = await connection.execute(
        "SELECT id, name, city, address FROM schools LIMIT 5"
      );

      const schoolInfo = rows
        .map((s) => `${s.name} in ${s.city}, address: ${s.address}`)
        .join("\n");

      systemMessage.content += `\n\nDatabase context:\n${schoolInfo}`;
    }

    const messagesWithSystem = [systemMessage, ...messages];

    // ✅ Groq API call
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: messagesWithSystem,
          temperature: 0.7,
          max_tokens: 512,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return res.status(response.status).json({
        error: errorData?.error || "Error from Groq API",
      });
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || "";

    return res.status(200).json({ reply, raw: data });
  } catch (error) {
    console.error("API handler error:", error);
    return res.status(500).json({ error: error.message });
  }
}
