// pages/api/news-export.js
export default async function handler(req, res) {
  try {
    const type = (req.query.type || "csv").toLowerCase();

    // Build a correct base URL from the incoming request.
    // Prefer forwarded protocol when behind proxies; fall back to http.
    const proto = req.headers["x-forwarded-proto"] || "http";
    const host = req.headers.host || `localhost:${process.env.PORT || 3000}`;
    const base = `${proto}://${host}`;

    // Fetch news from your internal API
    const apiRes = await fetch(`${base}/api/news`, {
      headers: { "Content-Type": "application/json" },
    });

    if (!apiRes.ok) {
      const txt = await apiRes.text().catch(() => "Unable to read body");
      return res.status(500).json({ error: "Failed to fetch news: " + txt });
    }

    const json = await apiRes.json().catch(() => null);
    const news = Array.isArray(json?.data) ? json.data : (Array.isArray(json) ? json : []);

    // helper to escape csv values (handles quotes, commas, newlines)
    const escapeCsv = (val = "") => {
      if (val === null || val === undefined) return "";
      const s = String(val);
      if (/[,"\r\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
      return s;
    };

    if (type === "sql") {
      // Generate simple INSERT statements for a `news` table.
      // Adjust column names and table name as needed for your schema.
      const cols = ["_id", "title", "content", "image", "imgId", "isPublished", "createdAt", "publishedAt"];
      let sql = `-- news export generated at ${new Date().toISOString()}\n\n`;
      for (const row of news) {
        const values = cols.map((c) => {
          let v = row?.[c];
          if (v === null || v === undefined) return "NULL";
          // For objects/arrays, JSON stringify
          if (typeof v === "object") v = JSON.stringify(v);
          // Escape single quotes for SQL
          return "'" + String(v).replace(/'/g, "''") + "'";
        }).join(", ");
        sql += `INSERT INTO news (${cols.join(", ")}) VALUES (${values});\n`;
      }

      res.setHeader("Content-Type", "text/sql; charset=utf-8");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="news-export-${Date.now()}.sql"`
      );
      return res.status(200).send(sql);
    }

    // Default -> CSV export
    const csvCols = ["_id", "title", "content", "image", "imgId", "isPublished", "createdAt", "publishedAt"];
    let csv = csvCols.join(",") + "\n";

    for (const r of news) {
      const row = csvCols.map((c) => {
        let v = r?.[c];
        if (typeof v === "object" && v !== null) v = JSON.stringify(v);
        return escapeCsv(v);
      }).join(",");
      csv += row + "\n";
    }

    // Prepend UTF-8 BOM so Excel recognizes UTF-8
    const csvWithBom = "\uFEFF" + csv;

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="news-export-${Date.now()}.csv"`
    );
    return res.status(200).send(csvWithBom);
  } catch (err) {
    console.error("Export error:", err);
    return res.status(500).json({ error: err?.message || "Unknown error" });
  }
}
