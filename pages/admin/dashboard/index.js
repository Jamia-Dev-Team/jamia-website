// pages/admin/dashboard/index.jsx
import React from "react";


export default function AdminDashboardPage() {
  return (
<div className="flex items-center gap-4">
  {/* <NewsExportButtons /> */}
  <button className="bg-emerald-600 py-1 px-7 text-white rounded" onClick={() => setIsOpen(true)}>
    Add
  </button>
</div>

  );
}
