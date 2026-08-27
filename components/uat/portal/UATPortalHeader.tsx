'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useUATTester } from '@/components/uat/UATTesterProvider';
import NotificationDropdown from '@/components/uat/NotificationDropdown';
import UATAccountMenu from './UATAccountMenu';
import { useRealtimeNotifications } from '@/hooks/useRealtimeNotifications';

interface UATPortalHeaderProps {
  onMenuClick: () => void;
  showMobileMenu?: boolean;
}

export default function UATPortalHeader({ onMenuClick, showMobileMenu = true }: UATPortalHeaderProps) {
  const router = useRouter();
  const { userId } = useUATTester();
  const { notifications, unreadCount, markAllRead, markRead, clearAll } = useRealtimeNotifications(userId || null);

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-100 bg-white/95 px-5 backdrop-blur lg:px-8">
      <div className="flex items-center gap-4">
        {showMobileMenu && (
          <button
            onClick={onMenuClick}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden cursor-pointer"
            aria-label="Open menu"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>
        )}
        <Link href="/" className="hidden items-center gap-2 text-xl font-bold text-[#2878d0] sm:flex whitespace-nowrap">
          DFP <span className="font-normal text-slate-300">/</span> <span className="text-sm font-medium text-[#17325c]">Digital Footprint</span>
        </Link>
        <span className="hidden text-sm font-bold text-[#2878d0] sm:inline whitespace-nowrap">UAT Tester Portal</span>
      </div>
      <div className="flex items-center gap-4">
        <NotificationDropdown
          unreadCount={unreadCount}
          notifications={notifications}
          markAllRead={markAllRead}
          markRead={markRead}
          clearAll={clearAll}
        />
        <UATAccountMenu />
      </div>
    </header>
  );
}