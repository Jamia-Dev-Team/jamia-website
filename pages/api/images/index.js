// pages/api/images/index.js
const { getPool } = require("../../../utils/db");

module.exports = async (req, res) => {
  const { method } = req;
  const pool = getPool();

  try {
    switch (method) {
      // GET all images
      case "GET": {
        const result = await pool.query(
          "SELECT * FROM images ORDER BY id DESC"
        );
        return res.status(200).json({
          success: true,
          data: result.rows,
        });
      }

      // POST new image
      case "POST": {
        const { image, imgid } = req.body;

        if (!image || !imgid) {
          return res.status(400).json({
            success: false,
            error: "image and imgid are required",
          });
        }

        const insertQuery =
          "INSERT INTO images (image, imgid) VALUES ($1, $2) RETURNING *";
        const values = [image, imgid];

        const result = await pool.query(insertQuery, values);

        return res.status(200).json({
          success: true,
          data: result.rows[0],
        });
      }

      default: {
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).json({
          success: false,
          error: `Method ${method} not allowed`,
        });
      }
    }
  } catch (err) {
    console.error("Images API error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
