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
    default: 'bg-[#131b2f]/80 backdrop-blur-xl border border-white/5 p-5 shadow-2xl shadow-black/40',
    stat: 'bg-gradient-to-br from-[#131b2f]/90 to-[#0a0f1c]/80 backdrop-blur-xl border border-white/5 p-5 shadow-2xl shadow-black/40 group hover:border-cyan-500/20',
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

export function StatCard({ label, value, icon, trend, iconBg = 'bg-cyan-500/10 text-cyan-400' }: StatCardProps) {
  return (
    <Card variant="stat">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300 ${iconBg}`}>
          {icon}
        </div>
        {trend && (
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              trend.positive
                ? 'bg-emerald-500/10 text-emerald-400'
                : 'bg-red-500/10 text-red-400'
            }`}
          >
            {trend.value}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-3xl font-black text-white tracking-tight drop-shadow-sm">{value}</p>
        <p className="text-sm font-medium text-slate-400 mt-1">{label}</p>
      </div>
      
      {/* Subtle shine effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/[0.02] to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </Card>
  );
}
