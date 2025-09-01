// pages/api/schools.js
import { connectDB } from "../../lib/db";
import multer from "multer";
import path from "path";

// Configure multer for file uploads
const upload = multer({
  dest: "public/schoolImages",
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    console.log("File filter processing:", {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    });

    // Check if file is an image
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      console.log("File validation passed");
      return cb(null, true);
    } else {
      console.log("File validation failed - not an allowed image type");
      cb(new Error("Only image files are allowed!"));
    }
  },
});

// Helper function to run middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        console.error("Middleware error:", result);
        return reject(result);
      }
      console.log("Middleware executed successfully");
      return resolve(result);
    });
  });
}

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
      // Handle file upload
      console.log("Running multer middleware for file upload...");
      await runMiddleware(req, res, upload.single("image"));
      console.log("File upload middleware completed");
      console.log("Uploaded file details:", req.file);

      const { name, address, city, state, contact, email_id } = req.body;
      console.log("Request body data:", {
        name,
        address,
        city,
        state,
        contact,
        email_id,
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

      // Check if file was uploaded
      console.log("Checking if file was uploaded...");
      if (!req.file) {
        console.log("File upload failed: No file received");
        return res.status(400).json({ error: "Image file is required" });
      }
      console.log("File upload validation passed");

      const imagePath = `/schoolImages/${req.file.filename}`;
      console.log("Image path generated:", imagePath);

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
          imagePath,
          email_id,
        ]);
        await db.execute(
          "INSERT INTO schools (name, address, city, state, contact, image, email_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [name, address, city, state, contact, imagePath, email_id]
        );
        console.log("School data inserted successfully");

        res.status(201).json({
          message: "School added successfully!",
          imagePath: imagePath,
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

    // Handle multer errors
    if (error.code === "LIMIT_FILE_SIZE") {
      console.log("File size limit exceeded");
      return res
        .status(400)
        .json({ error: "File size too large. Maximum 5MB allowed." });
    }

    if (error.message === "Only image files are allowed!") {
      console.log("Invalid file type uploaded");
      return res
        .status(400)
        .json({ error: "Only image files (JPEG, JPG, PNG, GIF) are allowed." });
    }

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

export const config = {
  api: {
    bodyParser: false, // Required for multer
  },
};
