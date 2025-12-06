const { getPool } = require("../../../utils/db");

const makeSlug = (title) => {
  if (!title) return null;
  return (
    title
      .toLowerCase()
      .trim()
      .replace(/[^0-9\p{L}]+/gu, "-")
      .replace(/^-+|-+$/g, "") +
    "-" +
    Date.now()
  );
};

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
        } = req.body || {};

        // Generate slug on server if not provided
        const finalSlug =
          slug && slug.trim()
            ? slug
            : makeSlug(title);

        // Better error: say *which* field is missing
        const missing = [];
        if (!title) missing.push("title");
        if (!content) missing.push("content");
        if (!image) missing.push("image");
        if (!finalSlug) missing.push("slug");

        if (missing.length) {
          console.log("NEWS POST missing fields:", { body: req.body, missing });
          return res.status(400).json({
            success: false,
            error: `Missing required fields: ${missing.join(", ")}`,
          });
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
          finalSlug,
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
