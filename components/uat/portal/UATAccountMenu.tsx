'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useUATTester } from '@/components/uat/UATTesterProvider';
import { ChevronDown, UserRound, WalletCards, HelpCircle, LogOut, Landmark } from 'lucide-react';

export default function UATAccountMenu() {
  const router = useRouter();
  const { tester } = useUATTester();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace('/login');
  };

  const initials = tester?.full_name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'TS';
  const firstName = tester?.full_name?.split(' ')[0] || 'Tester';
  const email = tester?.email || '';

  const links = [
    { label: 'My Profile', href: '/uat/profile', icon: UserRound },
    { label: 'Payments', href: '/uat/payments', icon: WalletCards },
    { label: 'Payment Account', href: '/uat/payments/account', icon: Landmark },
    { label: 'Help & Support', href: '/account/help', icon: HelpCircle },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-3 rounded-full bg-white py-1 pl-1 pr-3 hover:bg-slate-50 transition cursor-pointer"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8f0e1] font-bold text-[#617a50] text-sm">
          {initials}
        </span>
        <span className="hidden text-left sm:block">
          <span className="block text-sm font-semibold text-[#17325c]">{firstName}</span>
          <span className="block text-xs text-[#789265] capitalize">{tester?.status || 'Active'}</span>
        </span>
        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl"
          role="menu"
        >
          <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e8f0e1] font-bold text-[#617a50]">
              {initials}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#17325c]">{tester?.full_name || 'Tester'}</p>
              {email && <p className="truncate text-xs text-slate-500">{email}</p>}
            </div>
          </div>

          <div className="p-2">
            {links.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                role="menuitem"
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-[#17325c]"
              >
                <Icon className="h-5 w-5 text-slate-400" />
                {label}
              </Link>
            ))}
          </div>

          <div className="border-t border-slate-100 p-2">
            <button
              onClick={handleSignOut}
              role="menuitem"
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 cursor-pointer"
            >
              <LogOut className="h-5 w-5" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}