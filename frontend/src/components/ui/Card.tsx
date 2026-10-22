import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div className={`bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: CardProps) {
  return <div className={`p-5 border-b border-[#E2E8F0] ${className}`}>{children}</div>;
}

export function CardContent({ children, className = '' }: CardProps) {
  return <div className={`p-5 ${className}`}>{children}</div>;
}
