import React from 'react';

interface BadgeProps {
  status: 'pending' | 'submitted' | 'graded' | 'processing' | 'default';
  children: React.ReactNode;
}

export function Badge({ status, children }: BadgeProps) {
  const styles = {
    pending: "bg-amber-50 text-amber-700 border border-amber-200",
    submitted: "bg-blue-50 text-blue-700 border border-blue-200",
    graded: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    processing: "bg-purple-50 text-purple-700 border border-purple-200",
    default: "bg-slate-100 text-slate-700 border border-slate-200"
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
      {children}
    </span>
  );
}
