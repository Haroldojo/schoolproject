// pages/api/embeddings.js
import { connectDB } from "../../lib/db";
import { cosineSimilarity } from "../../lib/utils"; // we'll write this helper

let vectorStore = []; // in-memory store

export default async function handler(req, res) {
  if (req.method === "POST") {
    // Generate embeddings from DB
    try {
      const db = await connectDB();
      const [schools] = await db.execute("SELECT * FROM schools");

      vectorStore = [];

      const embeddings = new OpenAIEmbeddings({
        apiKey: process.env.OPENAI_API_KEY,
      });

      for (const school of schools) {
        const combinedText = `${school.name} ${school.address} ${school.city}`;
        const vector = await embeddings.embedQuery(combinedText);
        await db.execute(
          "INSERT INTO school_embeddings (school_id, embedding) VALUES (?, ?)",
          [school.id, JSON.stringify(vector)]
        );

        vectorStore.push({
          id: school.id,
          vector,
          data: school,
        });
      }

      return res
        .status(200)
        .json({ message: "Embeddings generated", count: vectorStore.length });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === "GET") {
    // Search query
    try {
      const query = req.query.q;
      if (!query) return res.status(400).json({ error: "Missing query ?q=" });

      const embeddings = new OpenAIEmbeddings({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const queryVector = await embeddings.embedQuery(query);

      // Compare similarity
      const results = vectorStore
        .map((item) => ({
          ...item,
          score: cosineSimilarity(queryVector, item.vector),
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 5); // top 5 matches

      return res.status(200).json({ results });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
