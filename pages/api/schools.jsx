// pages/api/schools.js
import { connectDB } from "../../lib/db";

export default async function handler(req, res) {
  console.log(
    `[${new Date().toISOString()}] ${
      req.method
    } /api/schools - Request received`
  );
  console.log("Request headers:", req.headers);

  try {
    if (req.method === "POST") {
      console.log("Processing POST request for adding school");

      const { name, address, city, state, contact, email_id, image } = req.body;
      console.log("Request body data:", {
        name,
        address,
        city,
        state,
        contact,
        email_id,
        image,
      });

      // Validate required fields
      console.log("Validating required fields...");
      if (!name || !address || !city || !state || !contact || !email_id) {
        console.log("Validation failed: Missing required fields");
        return res.status(400).json({
          error:
            "All fields are required: name, address, city, state, contact, email_id",
        });
      }
      console.log("Required fields validation passed");

      // Validate email format
      console.log("Validating email format...");
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email_id)) {
        console.log("Email validation failed:", email_id);
        return res.status(400).json({ error: "Invalid email format" });
      }
      console.log("Email validation passed");

      // Validate image URL if provided
      if (image) {
        console.log("Validating image URL format...");
        try {
          new URL(image);
          console.log("Image URL validation passed");
        } catch (urlError) {
          console.log("Image URL validation failed:", image);
          return res.status(400).json({ error: "Invalid image URL format" });
        }
      }

      let db;
      try {
        console.log("Connecting to database...");
        db = await connectDB();
        console.log("Database connection established");

        console.log("Executing INSERT query with data:", [
          name,
          address,
          city,
          state,
          contact,
          image || null,
          email_id,
        ]);
        await db.execute(
          "INSERT INTO schools (name, address, city, state, contact, image, email_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [name, address, city, state, contact, image || null, email_id]
        );
        console.log("School data inserted successfully");

        res.status(201).json({
          message: "School added successfully!",
          imageUrl: image || null,
        });
        console.log("Success response sent to client");
      } catch (dbError) {
        console.error("Database operation failed:", dbError);
        console.error("Database error details:", {
          message: dbError.message,
          code: dbError.code,
          errno: dbError.errno,
          sqlState: dbError.sqlState,
          sqlMessage: dbError.sqlMessage,
        });
        res.status(500).json({ error: "Database operation failed" });
      } finally {
        if (db) {
          console.log("Closing database connection...");
          await db.end();
          console.log("Database connection closed");
        }
      }
    } else if (req.method === "GET") {
      console.log("Processing GET request for fetching schools");
      let db;
      try {
        console.log("Connecting to database for fetching schools...");
        db = await connectDB();
        console.log("Database connection established for GET request");

        console.log("Executing SELECT query...");
        const [rows] = await db.execute(
          "SELECT * FROM schools ORDER BY name ASC"
        );
        console.log(`Found ${rows.length} schools in database`);
        console.log(
          "Sample data (first school):",
          rows[0] || "No schools found"
        );

        res.status(200).json(rows);
        console.log("Schools data sent to client successfully");
      } catch (dbError) {
        console.error("Database error during GET request:", dbError);
        console.error("GET request database error details:", {
          message: dbError.message,
          code: dbError.code,
          errno: dbError.errno,
        });
        res.status(500).json({ error: "Failed to fetch schools" });
      } finally {
        if (db) {
          console.log("Closing database connection for GET request...");
          await db.end();
          console.log("Database connection closed for GET request");
        }
      }
    } else {
      // Method not allowed
      console.log(`Method ${req.method} not allowed`);
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error("=== API ERROR CAUGHT ===");
    console.error("Error timestamp:", new Date().toISOString());
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    console.error("Request method:", req.method);
    console.error("Request URL:", req.url);
    console.error("========================");

    console.log("Sending generic server error response");
    res.status(500).json({ error: `Server error: ${error.message}` });
  } finally {
    console.log(
      `[${new Date().toISOString()}] ${
        req.method
      } /api/schools - Request completed\n`
    );
  }
}

// Regular bodyParser is fine since we're not handling file uploads
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "1mb",
    },
  },
};
