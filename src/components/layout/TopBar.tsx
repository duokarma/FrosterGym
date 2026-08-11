import { Menu, Bell } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Avatar } from '../ui/Avatar';

interface TopBarProps {
  onMenuToggle: () => void;
}

export function TopBar({ onMenuToggle }: TopBarProps) {
  const { profile, gym } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-[#0B0B0A]/90 backdrop-blur-xl border-b border-[rgba(255,255,255,0.08)] shadow-sm">
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-[#A7A39A] hover:text-[#F4F1E8] hover:bg-[#1D1B17] transition-colors lg:hidden"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden lg:block">
            <h1 className="text-sm font-semibold text-[#F4F1E8]">{gym?.name || 'Froaster Gym'}</h1>
          </div>
        </div>

        <div className="lg:hidden">
          <h1 className="text-sm font-bold text-[#F4F1E8] tracking-tight">{gym?.name || 'Froaster Gym'}</h1>
        </div>

        <div className="flex items-center gap-2">
          <button className="w-10 h-10 rounded-xl flex items-center justify-center text-[#A7A39A] hover:text-[#F4F1E8] hover:bg-[#1D1B17] transition-colors relative">
            <Bell className="w-5 h-5" />
          </button>
          <Avatar
            src={profile?.avatar_url}
            name={profile?.full_name || 'User'}
            size="sm"
          />
        </div>
      </div>
    </header>
  );
}
