import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'stat';
  onClick?: () => void;
}

export function Card({ children, className = '', variant = 'default', onClick }: CardProps) {
  const baseClasses = 'rounded-3xl transition-all duration-300 relative overflow-hidden';
  const variantClasses = {
    default: 'bg-[#11110F] border border-[rgba(255,255,255,0.08)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]',
    stat: 'bg-[#11110F] border border-[rgba(255,255,255,0.08)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] group hover:border-[#C9A24D]/30 hover:bg-[#171613]',
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${onClick ? 'cursor-pointer active:scale-[0.98]' : ''} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: { value: string; positive: boolean };
  iconBg?: string;
}

export function StatCard({ label, value, icon, trend, iconBg = 'text-[#A7A39A]' }: StatCardProps) {
  return (
    <Card variant="stat">
      <div className="flex items-start justify-between mb-3">
        <div className={`flex items-center justify-center transition-transform duration-300 ${iconBg}`}>
          {icon}
        </div>
        {trend && (
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              trend.positive
                ? 'bg-[#4D6B5A]/20 text-[#4D6B5A]'
                : 'bg-[#8B4B4B]/20 text-[#8B4B4B]'
            }`}
          >
            {trend.value}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-3xl font-black text-[#F4F1E8] tracking-tight">{value}</p>
        <p className="text-sm font-medium text-[#706D66] mt-1">{label}</p>
      </div>
      
      {/* Subtle shine effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/[0.02] to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </Card>
  );
}
