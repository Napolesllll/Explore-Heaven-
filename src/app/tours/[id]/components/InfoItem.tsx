import React from "react";

export function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-4 p-6 bg-black/20 backdrop-blur-sm rounded-2xl border border-indigo-500/20 hover:border-indigo-400/50 transition-all duration-300 shadow-sm hover:shadow-indigo-500/20 group">
      <div className="p-3 rounded-xl bg-indigo-900/50 border border-indigo-500/20 shadow-inner group-hover:bg-indigo-800/50 transition-all">
        {icon}
      </div>
      <div>
        <div className="text-sm text-indigo-300">{label}</div>
        <div className="text-lg font-semibold text-white mt-1">{value}</div>
      </div>
    </div>
  );
}
