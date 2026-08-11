import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const variantClasses = {
  primary:
    'bg-gradient-to-r from-[#D4AF37] to-[#D4AF37] hover:from-[#E5D3B3] hover:to-[#E5D3B3] active:from-[#B8972E] active:to-[#B8972E] text-white shadow-lg shadow-[#D4AF37]/25 border border-white/10',
  secondary:
    'bg-white/5 hover:bg-white/10 active:bg-white/5 text-slate-100 border border-white/10 backdrop-blur-md',
  ghost:
    'bg-transparent hover:bg-white/5 active:bg-white/10 text-slate-300',
  danger:
    'bg-red-500/10 hover:bg-red-500/20 active:bg-red-500/30 text-red-400 border border-red-500/20 shadow-lg shadow-red-500/10',
};

const sizeClasses = {
  sm: 'h-9 px-3 text-sm gap-1.5',
  md: 'h-11 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  icon,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center font-semibold rounded-2xl
        transition-all duration-300 ease-out active:scale-95
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0f1c]
        disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100
        min-h-[44px]
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}
