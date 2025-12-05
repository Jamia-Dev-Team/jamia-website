// pages/api/news/index.js
const { getPool } = require("../../../utils/db");

module.exports = async (req, res) => {
  const pool = getPool();

  switch (req.method) {
    case "POST": {
      try {
        const {
          title,
          content,
          image,
          imgId,
          isPublished,
          publishedAt,
          category,
          slug,
        } = req.body;

        if (!title || !content || !image || !slug) {
          return res
            .status(400)
            .json({ success: false, error: "Missing required fields" });
        }

        const q = `
          INSERT INTO news
            (title, content, image, imgid, ispublished, publishedat, category, slug)
          VALUES
            ($1,    $2,      $3,    $4,    $5,         $6,         $7,       $8)
          RETURNING *;
        `;

        const values = [
          title,
          content,
          image,
          imgId,
          isPublished ?? false,
          publishedAt,
          category || "Events",
          slug,
        ];

        const { rows } = await pool.query(q, values);

        return res.status(201).json({ success: true, data: rows[0] });
      } catch (error) {
        console.error("NEWS POST ERROR:", error);
        return res
          .status(500)
          .json({ success: false, error: error.message || "Server error" });
      }
    }

    case "GET": {
      // existing code that lists all news
      try {
        const q = "SELECT * FROM news ORDER BY createdat DESC";
        const { rows } = await pool.query(q);
        return res.status(200).json({ success: true, data: rows });
      } catch (error) {
        console.error("NEWS LIST ERROR:", error);
        return res
          .status(500)
          .json({ success: false, error: error.message || "Server error" });
      }
    }

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res
        .status(405)
        .json({ success: false, error: `Method ${req.method} Not Allowed` });
  }
};
