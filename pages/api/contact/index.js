// pages/api/contact/index.js
const { getPool } = require("../../../utils/db");

module.exports = async (req, res) => {
  const pool = getPool();

  switch (req.method) {
    // CREATE – from public contact form
    case "POST": {
      try {
        const { name, email, phone, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
          return res.status(400).json({
            success: false,
            message: "Name, email, subject and message are required.",
          });
        }

        // ✅ PostgreSQL uses $1, $2, ... placeholders (NOT ?)
        const insertQuery = `
          INSERT INTO contacts (name, email, phone, subject, message, status)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING id;
        `;

        const values = [
          name,
          email,
          phone || null,
          subject,
          message,
          "new",
        ];

        const result = await pool.query(insertQuery, values);

        return res.status(201).json({
          success: true,
          message: "Message saved successfully.",
          id: result.rows[0].id,
        });
      } catch (error) {
        console.error("Error saving contact message:", error);
        return res.status(500).json({
          success: false,
          message: "Internal server error.",
        });
      }
    }

    // LIST – for admin
    case "GET": {
      try {
        const selectQuery = `
          SELECT id, name, email, phone, subject, message, status, created_at
          FROM contacts
          ORDER BY created_at DESC;
        `;

        const result = await pool.query(selectQuery);

        return res.status(200).json({
          success: true,
          data: result.rows,
        });
      } catch (error) {
        console.error("Error fetching contact messages:", error);
        return res.status(500).json({
          success: false,
          message: "Internal server error.",
        });
      }
    }

    default: {
      res.setHeader("Allow", ["POST", "GET"]);
      return res
        .status(405)
        .json({ success: false, message: `Method ${req.method} not allowed` });
    }
  }
};
