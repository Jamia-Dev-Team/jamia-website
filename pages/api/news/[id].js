// pages/api/news/[id].js
const { getPool } = require("../../../utils/db");

function mapNewsRow(row) {
  if (!row) return null;

  return {
    id: row.id,
    title: row.title,
    category: row.category,
    content: row.content,
    image: row.image,
    imgId: row.imgid,
    // expose both camelCase and lowercase for convenience
    isPublished: row.ispublished,
    ispublished: row.ispublished,
    createdAt: row.createdat,
    createdat: row.createdat,
    publishedAt: row.publishedat,
    publishedat: row.publishedat,
  };
}

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  const pool = getPool();

  // basic validation + convert to integer
  const numericId = parseInt(id, 10);
  if (Number.isNaN(numericId)) {
    return res
      .status(400)
      .json({ success: false, error: "Valid numeric id is required" });
  }

  try {
    switch (method) {
      // GET: one news by id
      case "GET": {
        const q = `
          SELECT id, title, category, content, image, imgid,
                 ispublished, createdat, publishedat
          FROM news
          WHERE id = $1
          LIMIT 1
        `;
        const { rows } = await pool.query(q, [numericId]);

        if (!rows || rows.length === 0) {
          return res
            .status(404)
            .json({ success: false, error: "Not found" });
        }

        return res.status(200).json({
          success: true,
          data: mapNewsRow(rows[0]),
        });
      }

      // PUT: update by id (partial update, accepts camelCase + lowercase)
      case "PUT": {
        const body = req.body || {};

        const {
          title,
          category,
          content,
          image,
          imgId,
          slug, // in case you added slug
        } = body;

        // accept both isPublished and ispublished
        const finalIsPublished =
          typeof body.isPublished !== "undefined"
            ? body.isPublished
            : body.ispublished;

        // accept both publishedAt and publishedat
        const finalPublishedAt =
          typeof body.publishedAt !== "undefined"
            ? body.publishedAt
            : body.publishedat;

        const fields = [];
        const values = [];
        let idx = 1;

        if (typeof title !== "undefined") {
          fields.push(`title = $${idx++}`);
          values.push(title);
        }
        if (typeof category !== "undefined") {
          fields.push(`category = $${idx++}`);
          values.push(category);
        }
        if (typeof content !== "undefined") {
          fields.push(`content = $${idx++}`);
          values.push(content);
        }
        if (typeof image !== "undefined") {
          fields.push(`image = $${idx++}`);
          values.push(image);
        }
        if (typeof imgId !== "undefined") {
          fields.push(`imgid = $${idx++}`);
          values.push(imgId);
        }
        if (typeof slug !== "undefined") {
          fields.push(`slug = $${idx++}`);
          values.push(slug);
        }
        if (typeof finalIsPublished !== "undefined") {
          fields.push(`ispublished = $${idx++}`);
          values.push(finalIsPublished);
        }
        if (typeof finalPublishedAt !== "undefined") {
          fields.push(`publishedat = $${idx++}`);
          values.push(
            finalPublishedAt ? new Date(finalPublishedAt) : null
          );
        }

        if (fields.length === 0) {
          return res.status(400).json({
            success: false,
            error: "No updatable fields provided",
          });
        }

        const setClause = fields.join(", ");
        values.push(numericId); // WHERE id = $idx

        const updateQ = `
          UPDATE news
          SET ${setClause}
          WHERE id = $${idx}
          RETURNING id, title, category, content, image, imgid,
                    ispublished, createdat, publishedat
        `;

        const { rows } = await pool.query(updateQ, values);

        if (!rows || rows.length === 0) {
          return res
            .status(404)
            .json({ success: false, error: "Not found" });
        }

        return res.status(200).json({
          success: true,
          data: mapNewsRow(rows[0]),
        });
      }

      // DELETE: delete by id
      case "DELETE": {
        const delQ = `DELETE FROM news WHERE id = $1 RETURNING id`;
        const { rows } = await pool.query(delQ, [numericId]);

        if (!rows || rows.length === 0) {
          return res
            .status(404)
            .json({ success: false, error: "Not found" });
        }

        return res.status(200).json({ success: true, data: {} });
      }

      default:
        res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
        return res.status(405).json({
          success: false,
          error: `Method ${method} Not Allowed`,
        });
    }
  } catch (err) {
    console.error("news/[id] API error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
