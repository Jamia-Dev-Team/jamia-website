// "use client";

// import React, { useState } from "react";

// const escapeCsv = (val = "") => {
//   if (val === null || val === undefined) return "";
//   const s = String(val);
//   if (/[,"\r\n]/.test(s)) {
//     return '"' + s.replace(/"/g, '""') + '"';
//   }
//   return s;
// };

// const newsToCsv = (news = [], columns = ["_id","title","content","image","imgId","isPublished","createdAt","publishedAt"]) => {
//   const header = columns.join(",") + "\n";
//   const rows = news.map(row => {
//     return columns.map(c => {
//       let v = row[c];
//       if (typeof v === "object" && v !== null) v = JSON.stringify(v);
//       return escapeCsv(v);
//     }).join(",");
//   });
//   return header + rows.join("\n");
// };

// const downloadBlob = (content, filename, mime = "text/csv;charset=utf-8") => {
//   const blob = new Blob([content], { type: mime });
//   const url = URL.createObjectURL(blob);
//   const a = document.createElement("a");
//   a.href = url;
//   a.download = filename;
//   document.body.appendChild(a);
//   a.click();
//   a.remove();
//   URL.revokeObjectURL(url);
// };

// export default function NewsExportButtons({ apiPath = "/api/news" }) {
//   const [loading, setLoading] = useState(false);

//   // fetch only when user clicks — never in render
//   const fetchNews = async () => {
//     const res = await fetch(apiPath, { headers: { "Content-Type": "application/json" }});
//     if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
//     const json = await res.json();
//     return Array.isArray(json.data) ? json.data : json;
//   };

//   const handleCsvExport = async () => {
//     try {
//       setLoading(true);
//       const news = await fetchNews();
//       const csv = newsToCsv(news);
//       downloadBlob(csv, `news-export-${Date.now()}.csv`, "text/csv;charset=utf-8");
//     } catch (err) {
//       console.error("Export error", err);
//       alert("Export failed: " + (err.message || err));
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Optionally trigger server-side export (if you created /api/news/export)
//   const handleServerCsv = () => {
//     // open direct download; browser will fetch a non-JS response
//     window.location.href = "/api/news/export?type=csv";
//   };

//   return (
//     <div className="flex gap-2">
//       <button
//         onClick={handleCsvExport}
//         disabled={loading}
//         className="px-4 py-2 bg-emerald-600 text-white rounded disabled:opacity-60"
//       >
//         {loading ? "Preparing..." : "Download CSV (client)"}
//       </button>

//       <button
//         onClick={handleServerCsv}
//         className="px-4 py-2 bg-indigo-600 text-white rounded"
//       >
//         Download CSV (server)
//       </button>
//     </div>
//   );
// }



// components/PostersExportButtons.jsx

// "use client";

// import React, { useState } from "react";

// const escapeCsv = (val = "") => {
//   if (val === null || val === undefined) return "";
//   const s = String(val);
//   if (/[,"\r\n]/.test(s)) {
//     return '"' + s.replace(/"/g, '""') + '"';
//   }
//   return s;
// };

// const downloadBlob = (content, filename, mime = "text/csv;charset=utf-8") => {
//   const blob = new Blob([content], { type: mime });
//   const url = URL.createObjectURL(blob);
//   const a = document.createElement("a");
//   a.href = url;
//   a.download = filename;
//   document.body.appendChild(a);
//   a.click();
//   a.remove();
//   URL.revokeObjectURL(url);
// };

// // client-side CSV generator (useful for small sets)
// const postersToCsv = (posters = [], cols = ["_id","image","imgId","timeStamp"]) => {
//   const header = cols.join(",") + "\n";
//   const rows = posters.map(r => cols.map(c => {
//     let v = r[c];
//     if (typeof v === "object" && v !== null) v = JSON.stringify(v);
//     return escapeCsv(v);
//   }).join(","));
//   return header + rows.join("\n");
// };

// export default function PostersExportButtons({ apiPath = "/api/poster" }) {
//   const [loading, setLoading] = useState(false);

//   const fetchPosters = async () => {
//     const res = await fetch(apiPath, { headers: { "Content-Type": "application/json" }});
//     if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
//     const j = await res.json();
//     return Array.isArray(j.data) ? j.data : j;
//   };

//   const handleClientCsv = async () => {
//     try {
//       setLoading(true);
//       const posters = await fetchPosters();
//       const csv = postersToCsv(posters);
//       downloadBlob(csv, `posters-export-${Date.now()}.csv`, "text/csv;charset=utf-8");
//     } catch (err) {
//       console.error("Export client CSV error:", err);
//       alert("Export failed: " + (err.message || err));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleServerCsv = () => {
//     // triggers server-side endpoint which streams the CSV back
//     window.location.href = "/api/poster-export?type=csv";
//   };

//   const handleServerSql = () => {
//     window.location.href = "/api/poster-export?type=sql";
//   };

//   return (
//     <div className="flex gap-2">
//       <button
//         onClick={handleClientCsv}
//         disabled={loading}
//         className="px-3 py-2 bg-emerald-600 text-white rounded disabled:opacity-60"
//       >
//         {loading ? "Preparing..." : "Download CSV (client)"}
//       </button>

//       <button
//         onClick={handleServerCsv}
//         className="px-3 py-2 bg-indigo-600 text-white rounded"
//       >
//         Download CSV (server)
//       </button>

//       <button
//         onClick={handleServerSql}
//         className="px-3 py-2 bg-gray-800 text-white rounded"
//       >
//         Download SQL (server)
//       </button>
//     </div>
//   );
// }

// components/NewsExportButtons.jsx
"use client";

import React, { useState } from "react";

export default function NewsExportButtons() {
  const [loading, setLoading] = useState(false);

  const download = (type = "csv") => {
    // simple approach: open the endpoint which returns a file response
    // this triggers browser download
    window.location.href = `/api/news-export?type=${type}`;
  };

  const clientCsv = async () => {
    // optional: client-side CSV generation (small datasets)
    try {
      setLoading(true);
      const res = await fetch("/api/news");
      if (!res.ok) throw new Error("Failed to fetch news");
      const json = await res.json();
      const data = Array.isArray(json.data) ? json.data : json;

      const cols = ["_id","title","content","image","imgId","isPublished","createdAt","publishedAt"];
      const escape = (v = "") => {
        if (v === null || v === undefined) return "";
        const s = String(v);
        if (/[,"\r\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
        return s;
      };

      const rows = data.map(row => cols.map(c => {
        let v = row[c];
        if (typeof v === "object" && v !== null) v = JSON.stringify(v);
        return escape(v);
      }).join(","));

      const bom = '\uFEFF';
      const csv = bom + cols.join(",") + "\n" + rows.join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `news-export-${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Export failed: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <button
        onClick={() => download("csv")}
        className="px-3 py-2 bg-emerald-600 text-white rounded"
      >
        Download CSV (server)
      </button>

      <button
        onClick={() => download("sql")}
        className="px-3 py-2 bg-gray-800 text-white rounded"
      >
        Download SQL (server)
      </button>

      <button
        onClick={clientCsv}
        disabled={loading}
        className="px-3 py-2 bg-indigo-600 text-white rounded disabled:opacity-60"
      >
        {loading ? "Preparing..." : "Download CSV (client)"}
      </button>
    </div>
  );
}
