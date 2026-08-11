import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helper, icon, rightIcon, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-[#A7A39A] mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#706D66]">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`
              w-full h-12 rounded-xl bg-[#11110F] border text-[#F4F1E8] text-sm
              placeholder:text-[#706D66]
              transition-colors duration-150
              focus:outline-none focus:ring-2 focus:ring-[#C9A24D]/40 focus:border-[#C9A24D]
              disabled:opacity-50 disabled:cursor-not-allowed
              ${error ? 'border-[#8B4B4B]/50 focus:ring-[#8B4B4B]/40 focus:border-[#8B4B4B]' : 'border-[rgba(255,255,255,0.10)] hover:border-[rgba(255,255,255,0.20)]'}
              ${icon ? 'pl-10' : 'pl-4'}
              ${rightIcon ? 'pr-10' : 'pr-4'}
              ${className}
            `}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#706D66]">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1.5 text-sm text-[#8B4B4B]">{error}</p>}
        {helper && !error && <p className="mt-1.5 text-sm text-[#706D66]">{helper}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
