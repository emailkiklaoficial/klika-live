'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Home, Store, Plus, Radio, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigationStore } from '@/stores';
import type { ViewId } from '@/types';

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Navigation Item Definition
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

interface NavItem {
  id: ViewId;
  label: string;
  icon: React.ElementType;
  isCreate?: boolean;
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'marketplace', label: 'Marketplace', icon: Store },
  { id: 'create', label: 'Create', icon: Plus, isCreate: true },
  { id: 'live', label: 'Live', icon: Radio },
  { id: 'profile', label: 'Profile', icon: User },
];

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   BottomNav Component
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export default function BottomNav() {
  const { currentView, navigate } = useNavigationStore();
  const [scrolled, setScrolled] = useState(false);

  /* Track scroll position for glass effect */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (item: NavItem) => {
    navigate(item.id);
  };

  return (
    <nav
      aria-label="Main navigation"
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 lg:hidden',
        'safe-bottom transition-all duration-300',
        scrolled
          ? 'glass border-t border-border/50 shadow-lg shadow-black/5'
          : 'bg-background/90 border-t border-border/30',
      )}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          if (item.isCreate) {
            return <CreateButton key={item.id} item={item} onNav={handleNav} />;
          }

          const isActive = currentView === item.id;
          const Icon = item.icon;

          return (
            <motion.button
              key={item.id}
              type="button"
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
              whileTap={{ scale: 0.88 }}
              onClick={() => handleNav(item)}
              className={cn(
                'relative flex flex-col items-center justify-center gap-0.5',
                'min-w-[3.5rem] py-1 px-2 rounded-xl transition-colors duration-200',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground active:text-foreground',
              )}
            >
              <span className="relative">
                <Icon
                  className={cn(
                    'transition-all duration-200',
                    isActive ? 'w-[22px] h-[22px]' : 'w-5 h-5',
                  )}
                  strokeWidth={isActive ? 2.4 : 1.8}
                />
                {/* Active indicator dot */}
                {isActive && (
                  <motion.span
                    layoutId="bottomNavIndicator"
                    className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </span>
              <span
                className={cn(
                  'text-[10px] leading-tight transition-all duration-200',
                  isActive ? 'font-semibold' : 'font-medium',
                )}
              >
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Create Button — elevated gradient circle
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function CreateButton({ item, onNav }: { item: NavItem; onNav: (item: NavItem) => void }) {
  const Icon = item.icon;

  return (
    <motion.button
      type="button"
      aria-label={item.label}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      onClick={() => onNav(item)}
      className="relative flex items-center justify-center -mt-4"
    >
      <span
        className={cn(
          'flex items-center justify-center w-12 h-12 rounded-full shadow-lg',
          'bg-gradient-to-br from-primary to-primary/70',
          'text-primary-foreground',
          'transition-shadow duration-200 hover:shadow-xl',
        )}
      >
        <Icon className="w-6 h-6" strokeWidth={2.4} />
      </span>
    </motion.button>
  );
}
