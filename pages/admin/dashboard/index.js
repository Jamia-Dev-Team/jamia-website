// pages/admin/dashboard/index.jsx
import React from "react";
import NewsExportButtons from "../../../components/NewsExportButtons";
import ExportButtons from "../../../components/NewsExportButtons";
import PostersExportButtons from "../../../components/NewsExportButtons";


export default function AdminDashboardPage() {
  return (
<div className="flex items-center gap-3">
  <PostersExportButtons />
  <button className="bg-emerald-600 py-1 px-7 text-white rounded" onClick={() => setIsOpen(true)}>Add</button>
</div>
  );
}
