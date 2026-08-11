interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

const variantClasses = {
  default: 'bg-zinc-700/50 text-zinc-300',
  success: 'bg-[#4D6B5A]/20 text-[#4D6B5A]',
  warning: 'bg-[#8E7135]/20 text-[#8E7135]',
  danger: 'bg-[#8B4B4B]/20 text-[#8B4B4B]',
  info: 'bg-[#C9A24D]/10 text-[#E2C46B]',
};

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
