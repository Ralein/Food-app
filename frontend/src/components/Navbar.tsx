'use client';

import Link from 'next/link';
import { logout, User, canManagePayments } from '@/lib/auth';
import { FiSearch, FiShoppingCart, FiUser, FiLogOut, FiMenu } from 'react-icons/fi';

interface NavbarProps {
  user: User;
}

export default function Navbar({ user }: NavbarProps) {
  return (
    <nav className="bg-surface border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-12">
            <Link href="/dashboard" className="flex items-center gap-2">
              <span className="text-2xl">🌿</span>
              <span className="text-xl font-bold text-text-primary tracking-tight">HerbCream</span>
            </Link>

            <div className="hidden lg:flex items-center gap-8">
              <Link href="/dashboard" className="text-sm font-medium text-text-primary hover:text-primary transition-colors">
                Restaurants
              </Link>
              <Link href="/orders" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">
                Orders
              </Link>
              {canManagePayments(user) && (
                <Link href="/payments" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">
                  Payments
                </Link>
              )}
            </div>
          </div>

          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
              <input
                type="text"
                placeholder="Search for healthy meals..."
                className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-text-primary hover:bg-background rounded-full transition-colors">
              <FiShoppingCart className="w-6 h-6" />
              <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-white text-[10px] flex items-center justify-center rounded-full">3</span>
            </button>

            <div className="flex items-center gap-3 pl-6 border-l border-border">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-text-primary leading-tight">{user.name}</p>
                <div className="flex items-center justify-end gap-1 mt-0.5">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{user.role}</span>
                  <span className="text-xs">{user.country === 'INDIA' ? '🇮🇳' : '🇺🇸'}</span>
                </div>
              </div>
              <button className="p-2 bg-background text-text-primary rounded-xl hover:bg-accent/20 transition-colors">
                <FiUser className="w-5 h-5" />
              </button>
              <button
                onClick={logout}
                className="p-2 text-text-secondary hover:text-red-500 transition-colors"
                title="Logout"
              >
                <FiLogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
