// pages/api/news/limit/index.js
const { getPool } = require("../../../../utils/db");

// Map DB row (snake_case) → API object (camelCase)
function mapNewsRow(row) {
  if (!row) return null;

  return {
    _id: row._id,            // varchar id (if you have it)
    id: row.id,              // integer primary key
    title: row.title,
    content: row.content,
    image: row.image,
    imgId: row.imgid,
    isPublished: row.ispublished,
    createdAt: row.createdat,
    publishedAt: row.publishedat,
    category: row.category,
    slug: row.slug,
  };
}

export default async function handler(req, res) {
  const pool = getPool();
  const { method } = req;

  try {
    switch (method) {
      // GET → last 3 published news
      case "GET": {
        const q = `
          SELECT _id,
                 id,
                 title,
                 content,
                 image,
                 imgid,
                 ispublished,
                 createdat,
                 publishedat,
                 category,
                 slug
          FROM news
          WHERE ispublished = TRUE
          ORDER BY COALESCE(publishedat, createdat) DESC
          LIMIT 3
        `;
        const { rows } = await pool.query(q);

        return res.status(200).json({
          success: true,
          data: rows.map(mapNewsRow),
        });
      }

      // POST → create a news item (optionally used for seeding / tests)
      case "POST": {
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

        if (!title) {
          return res
            .status(400)
            .json({ success: false, error: "Title is required" });
        }

        const insertQ = `
          INSERT INTO news (
            title,
            content,
            image,
            imgid,
            ispublished,
            createdat,
            publishedat,
            category,
            slug
          )
          VALUES (
            $1,  -- title
            $2,  -- content
            $3,  -- image
            $4,  -- imgid
            $5,  -- ispublished
            NOW(), -- createdat
            $6,  -- publishedat
            $7,  -- category
            $8   -- slug
          )
          RETURNING
            _id,
            id,
            title,
            content,
            image,
            imgid,
            ispublished,
            createdat,
            publishedat,
            category,
            slug
        `;

        const values = [
          title,
          content ?? null,
          image ?? null,
          imgId ?? null,
          typeof isPublished === "boolean" ? isPublished : false,
          publishedAt ? new Date(publishedAt) : null,
          category || "Events",
          slug ?? null, // if you're always sending slug from frontend, this will be set
        ];

        const { rows } = await pool.query(insertQ, values);

        return res.status(200).json({
          success: true,
          data: mapNewsRow(rows[0]),
        });
      }

      default: {
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).json({
          success: false,
          error: `Method ${method} Not Allowed`,
        });
      }
    }
  } catch (err) {
    console.error("news/limit API error:", err);
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}
