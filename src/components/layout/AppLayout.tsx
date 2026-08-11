import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0B0B0A] selection:bg-[#C9A24D]/30 text-[#F4F1E8]">
      {/* Premium Subtle Ambient Warmth */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[50%] h-[50%] rounded-full bg-[#C9A24D]/[0.02] blur-[150px]" />
      </div>

      <div className="relative z-10">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex flex-col min-h-screen lg:ml-72">
        <TopBar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 px-4 py-4 pb-20 lg:pb-4 max-w-5xl mx-auto w-full">
          <Outlet />
        </main>
      </div>

      <BottomNav />
      </div>
    </div>
  );
}
