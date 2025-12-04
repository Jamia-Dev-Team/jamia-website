"use client";
import React, { useState } from "react";

export default function NewsExportButtons() {
  const [loading, setLoading] = useState(false);

  const downloadServer = (type = "csv") => {
    window.location.href = `/api/news-export?type=${type}`;
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => downloadServer("csv")}
        className="px-3 py-2 bg-emerald-600 text-white rounded"
      >
        Download CSV
      </button>
      <button
        onClick={() => downloadServer("sql")}
        className="px-3 py-2 bg-gray-800 text-white rounded"
      >
        Download SQL
      </button>
    </div>
  );
}
