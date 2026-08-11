import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  MoreHorizontal,
  Award,
  CalendarCheck,
  Utensils,
  UserCog,
  Receipt,
  BarChart3,
  MessageCircle,
  Settings,
} from 'lucide-react';
import { useState } from 'react';
import { BottomSheet } from '../ui/BottomSheet';
import { usePermissions } from '../../contexts/PermissionContext';
import { PERMISSIONS } from '../../lib/permissions';

interface MoreItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  permission?: string;
}

const moreItems: MoreItem[] = [
  { label: 'Memberships', icon: <Award className="w-5 h-5" />, path: '/memberships', permission: PERMISSIONS.MEMBERSHIPS_VIEW },
  { label: 'Attendance', icon: <CalendarCheck className="w-5 h-5" />, path: '/attendance', permission: PERMISSIONS.ATTENDANCE_VIEW },
  { label: 'Diet Plans', icon: <Utensils className="w-5 h-5" />, path: '/diet-plans', permission: PERMISSIONS.DIET_PLANS_VIEW },
  { label: 'Staff', icon: <UserCog className="w-5 h-5" />, path: '/staff', permission: PERMISSIONS.STAFF_VIEW },
  { label: 'Expenses', icon: <Receipt className="w-5 h-5" />, path: '/expenses', permission: PERMISSIONS.EXPENSES_VIEW },
  { label: 'Reports', icon: <BarChart3 className="w-5 h-5" />, path: '/reports', permission: PERMISSIONS.REPORTS_VIEW },
  { label: 'WhatsApp', icon: <MessageCircle className="w-5 h-5" />, path: '/whatsapp', permission: PERMISSIONS.WHATSAPP_VIEW },
  { label: 'Settings', icon: <Settings className="w-5 h-5" />, path: '/settings', permission: PERMISSIONS.SETTINGS_VIEW },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showMore, setShowMore] = useState(false);
  const { hasPermission, isOwner } = usePermissions();

  const canView = (permission?: string) => {
    if (!permission) return true;
    return isOwner || hasPermission(permission as any);
  };

  const isMoreActive = moreItems.some((item) => location.pathname === item.path);

  const tabs = [
    { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/' },
    { label: 'Members', icon: <Users className="w-5 h-5" />, path: '/members' },
    { label: 'Payments', icon: <CreditCard className="w-5 h-5" />, path: '/payments' },
    { label: 'More', icon: <MoreHorizontal className="w-5 h-5" />, path: '#more' },
  ];

  const handleTabClick = (path: string) => {
    if (path === '#more') {
      setShowMore(true);
    } else {
      navigate(path);
    }
  };

  const handleMoreItemClick = (path: string) => {
    navigate(path);
    setShowMore(false);
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-[#0a0a0a]/80 backdrop-blur-xl border-t border-white/5 lg:hidden">
        <div className="flex items-center justify-around h-16 pb-safe">
          {tabs.map((tab) => {
            const isActive =
              tab.path === '#more'
                ? isMoreActive
                : location.pathname === tab.path;

            return (
              <button
                key={tab.label}
                onClick={() => handleTabClick(tab.path)}
                className={`flex flex-col items-center justify-center gap-0.5 min-w-[64px] min-h-[44px] py-1 transition-colors duration-150 ${
                  isActive ? 'text-[#E5D3B3]' : 'text-slate-500'
                }`}
              >
                {tab.icon}
                <span className="text-[10px] font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* More Bottom Sheet */}
      <BottomSheet isOpen={showMore} onClose={() => setShowMore(false)} title="More">
        <div className="grid grid-cols-3 gap-3">
          {moreItems
            .filter((item) => canView(item.permission))
            .map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => handleMoreItemClick(item.path)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-150 min-h-[80px] ${
                    isActive
                      ? 'bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/10 text-[#E5D3B3] border border-[#D4AF37]/20 shadow-lg shadow-[#D4AF37]/10'
                      : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white active:scale-95'
                  }`}
                >
                  {item.icon}
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              );
            })}
        </div>
      </BottomSheet>
    </>
  );
}
