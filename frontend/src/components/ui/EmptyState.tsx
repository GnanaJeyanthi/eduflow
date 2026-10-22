import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-[#E2E8F0] rounded-xl bg-slate-50/50">
      <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-[#E2E8F0] flex items-center justify-center mb-4 text-[#2563EB]">
        <Icon size={24} />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-[#64748B] max-w-sm mb-6 text-sm leading-relaxed">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
