'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useNavigationStore } from '@/stores';
import type { ViewId } from '@/types';

import TopNav from '@/components/layout/TopNav';
import BottomNav from '@/components/layout/BottomNav';

/* ━── Lazy-loaded views ─────────────────────────────────────────────────── */
import dynamic from 'next/dynamic';

const HomeFeed = dynamic(() => import('@/components/views/HomeFeed'), { ssr: false });
const MarketplaceView = dynamic(() => import('@/components/views/MarketplaceView'), { ssr: false });
const LiveView = dynamic(() => import('@/components/views/LiveView'), { ssr: false });
const AuctionView = dynamic(() => import('@/components/views/AuctionView'), { ssr: false });
const NotificationsView = dynamic(() => import('@/components/views/NotificationsView'), { ssr: false });
const CartView = dynamic(() => import('@/components/views/CartView'), { ssr: false });
const ProfileView = dynamic(() => import('@/components/views/ProfileView'), { ssr: false });
const CreateView = dynamic(() => import('@/components/views/CreateView'), { ssr: false });
const SellerStudioView = dynamic(() => import('@/components/views/SellerStudioView'), { ssr: false });
const AnalyticsView = dynamic(() => import('@/components/views/AnalyticsView'), { ssr: false });
const LogisticsView = dynamic(() => import('@/components/views/LogisticsView'), { ssr: false });
const AuthLoginView = dynamic(() => import('@/components/views/AuthLoginView'), { ssr: false });
const AuthRegisterView = dynamic(() => import('@/components/views/AuthRegisterView'), { ssr: false });
const ProductDetailView = dynamic(() => import('@/components/views/ProductDetailView'), { ssr: false });
const SellerProfileView = dynamic(() => import('@/components/views/SellerProfileView'), { ssr: false });
const SearchView = dynamic(() => import('@/components/views/SearchView'), { ssr: false });

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   View Registry — maps ViewId to component
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const viewComponents: Record<ViewId, React.ComponentType> = {
  home: HomeFeed,
  marketplace: MarketplaceView,
  live: LiveView,
  auction: AuctionView,
  notifications: NotificationsView,
  cart: CartView,
  profile: ProfileView,
  create: CreateView,
  'seller-studio': SellerStudioView,
  analytics: AnalyticsView,
  logistics: LogisticsView,
  'auth-login': AuthLoginView,
  'auth-register': AuthRegisterView,
  'product-detail': ProductDetailView,
  'seller-profile': SellerProfileView,
  search: SearchView,
};

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Page Transition Variants
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const pageVariants = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
};

const pageTransition = {
  type: 'tween',
  ease: [0.32, 0.72, 0, 1],
  duration: 0.22,
};

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   AppShell — Main application wrapper
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export default function AppShell() {
  const currentView = useNavigationStore((s) => s.currentView);
  const ActiveView = viewComponents[currentView];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* ─── Top Navigation ─────────────────────────────────────────── */}
      <TopNav />

      {/* ─── Main Content ───────────────────────────────────────────── */}
      <main
        role="main"
        className="flex-1 pt-14 pb-20 lg:pb-4"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
            className="max-w-screen-2xl mx-auto w-full"
          >
            <ActiveView />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ─── Bottom Navigation (mobile only) ──────────────────────── */}
      <BottomNav />
    </div>
  );
}
