import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function BottomSheet({ isOpen, onClose, title, children }: BottomSheetProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      <div
        className="fixed inset-0 bg-[#0B0B0A]/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full bg-[#11110F] border-t border-[rgba(255,255,255,0.08)] rounded-t-2xl p-6 pb-8 shadow-lg shadow-black/20 max-h-[80vh] overflow-y-auto">
        <div className="w-10 h-1 bg-zinc-700 rounded-full mx-auto mb-4" />
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#F4F1E8]">{title}</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#A7A39A] hover:text-[#F4F1E8] hover:bg-[#171613] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
