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
    'bg-[#C9A24D] hover:bg-[#E2C46B] active:bg-[#8E7135] text-[#0B0B0A] shadow-[0_4px_14px_0_rgba(201,162,77,0.2)]',
  secondary:
    'bg-[#1D1B17] hover:bg-[rgba(255,255,255,0.08)] active:bg-[#11110F] text-[#F4F1E8] border border-[rgba(255,255,255,0.08)]',
  ghost:
    'bg-transparent hover:bg-[#1D1B17] active:bg-[rgba(255,255,255,0.08)] text-[#A7A39A] hover:text-[#F4F1E8]',
  danger:
    'bg-[#8B4B4B]/10 hover:bg-[#8B4B4B]/20 active:bg-[#8B4B4B]/30 text-[#8B4B4B] border border-[#8B4B4B]/20',
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
      type={props.type || 'button'}
      className={`
        inline-flex items-center justify-center font-semibold rounded-2xl
        transition-all duration-300 ease-out active:scale-95
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A24D] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0A]
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
