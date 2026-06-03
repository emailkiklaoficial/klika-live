'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Bell,
  ShoppingCart,
  Moon,
  Sun,
  LogIn,
  X,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { useNavigationStore, useAuthStore, useCartStore } from '@/stores';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   TopNav — Premium top navigation bar
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export default function TopNav() {
  const { navigate, setSearchQuery, searchQuery } = useNavigationStore();
  const { isAuthenticated, user } = useAuthStore();
  const cartItems = useCartStore((s) => s.items);
  const { theme, setTheme } = useTheme();

  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);

  /* Track scroll position for glass effect */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Hydration-safe theme toggle — detect client mount */
  // eslint-disable-next-line react-hooks/set-state-in-effect -- standard hydration guard pattern
  useEffect(() => { setMounted(true); }, []);

  /* Focus search input when expanded */
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const unreadCount = 3; // TODO: wire to notification store

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('search');
      setSearchOpen(false);
    }
  };

  return (
    <header
      role="banner"
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'safe-top transition-all duration-300',
        scrolled
          ? 'glass border-b border-border/50 shadow-lg shadow-black/5'
          : 'bg-background/90 border-b border-border/30',
      )}
    >
      <div className="flex items-center justify-between h-14 px-3 lg:px-6 max-w-screen-2xl mx-auto w-full">
        {/* ─── Left: Logo ──────────────────────────────────────── */}
        <button
          type="button"
          aria-label="KLIKA home"
          onClick={() => navigate('home')}
          className="flex items-center gap-1.5 shrink-0"
        >
          <img
            src="/klika-logo.png"
            alt="KLIKA"
            className="h-7 w-auto hidden sm:block"
          />
          <span className="text-xl font-black tracking-tight text-foreground sm:hidden">
            KLIKA
          </span>
        </button>

        {/* ─── Center: Search ──────────────────────────────────── */}
        <div className="flex-1 flex justify-center mx-2 lg:mx-8 max-w-xl">
          {/* Mobile: icon-only toggle */}
          <button
            type="button"
            aria-label="Search"
            className="lg:hidden flex items-center justify-center w-9 h-9 rounded-full hover:bg-muted transition-colors"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            {searchOpen ? (
              <X className="w-5 h-5 text-foreground" />
            ) : (
              <Search className="w-5 h-5 text-muted-foreground" />
            )}
          </button>

          {/* Desktop: always-visible search bar */}
          <form
            onSubmit={handleSearch}
            className="hidden lg:flex w-full"
          >
            <div
              className={cn(
                'flex items-center gap-2 w-full',
                'h-9 px-3 rounded-full',
                'bg-muted/60 border border-border/50',
                'focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary/50',
                'transition-all duration-200',
              )}
            >
              <Search className="w-4 h-4 text-muted-foreground shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, sellers, live..."
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
          </form>
        </div>

        {/* ─── Right: Actions ──────────────────────────────────── */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Notifications */}
          <motion.button
            type="button"
            aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
            whileTap={{ scale: 0.88 }}
            onClick={() => navigate('notifications')}
            className="relative flex items-center justify-center w-9 h-9 rounded-full hover:bg-muted transition-colors"
          >
            <Bell className="w-[18px] h-[18px] text-muted-foreground" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold animate-scale-pop">
                {unreadCount}
              </span>
            )}
          </motion.button>

          {/* Cart */}
          <motion.button
            type="button"
            aria-label={`Cart${cartCount > 0 ? ` (${cartCount} items)` : ''}`}
            whileTap={{ scale: 0.88 }}
            onClick={() => navigate('cart')}
            className="relative flex items-center justify-center w-9 h-9 rounded-full hover:bg-muted transition-colors"
          >
            <ShoppingCart className="w-[18px] h-[18px] text-muted-foreground" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold animate-scale-pop">
                {cartCount}
              </span>
            )}
          </motion.button>

          {/* Theme toggle */}
          <motion.button
            type="button"
            aria-label="Toggle dark mode"
            whileTap={{ scale: 0.88 }}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-muted transition-colors"
          >
            {mounted && theme === 'dark' ? (
              <Sun className="w-[18px] h-[18px] text-warning" />
            ) : (
              <Moon className="w-[18px] h-[18px] text-muted-foreground" />
            )}
          </motion.button>

          {/* Auth: Login button or Avatar */}
          {isAuthenticated && user ? (
            <motion.button
              type="button"
              aria-label="Profile"
              whileTap={{ scale: 0.88 }}
              onClick={() => navigate('profile')}
              className="ml-1"
            >
              <Avatar className="h-8 w-8 ring-2 ring-primary/20 ring-offset-1 ring-offset-background">
                <AvatarImage src={user.avatar} alt={user.displayName} />
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                  {user.displayName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </motion.button>
          ) : (
            <motion.button
              type="button"
              aria-label="Sign in"
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.03 }}
              onClick={() => navigate('auth-login')}
              className={cn(
                'hidden sm:flex items-center gap-1.5 ml-1',
                'h-8 px-3.5 rounded-full',
                'bg-primary text-primary-foreground',
                'text-xs font-semibold',
                'transition-shadow duration-200',
                'hover:shadow-lg hover:shadow-primary/20',
              )}
            >
              <LogIn className="w-3.5 h-3.5" />
              Sign In
            </motion.button>
          )}
        </div>
      </div>

      {/* ─── Mobile expanded search overlay ──────────────────── */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
            className="overflow-hidden lg:hidden border-t border-border/30"
          >
            <form onSubmit={handleSearch} className="px-3 py-2">
              <div
                className={cn(
                  'flex items-center gap-2 w-full',
                  'h-10 px-3 rounded-xl',
                  'bg-muted/60 border border-border/50',
                  'focus-within:ring-2 focus-within:ring-primary/30',
                  'transition-all duration-200',
                )}
              >
                <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, sellers, live streams..."
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
