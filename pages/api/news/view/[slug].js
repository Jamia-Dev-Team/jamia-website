// pages/api/news/view/[slug].js
const { getPool } = require("../../../../utils/db");

module.exports = async (req, res) => {
  const {
    query: { slug: slugParam },
    method,
  } = req;

  const pool = getPool();

  if (method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res
      .status(405)
      .json({ success: false, error: `Method ${method} Not Allowed` });
  }

  try {
    if (!slugParam) {
      return res
        .status(400)
        .json({ success: false, error: "slug required" });
    }

    // decode slug for Malayalam / Unicode URLs
    const slug = Array.isArray(slugParam)
      ? decodeURIComponent(slugParam[0])
      : decodeURIComponent(slugParam);

    console.log("NEWS VIEW BY SLUG:", slug);

    const q = `
      SELECT *
      FROM news
      WHERE slug = $1
      LIMIT 1
    `;
    const { rows } = await pool.query(q, [slug]);

    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, error: "Not found" });
    }

    return res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error("NEWS VIEW GET ERROR:", error);
    return res
      .status(500)
      .json({ success: false, error: error.message || "Server error" });
  }
};
