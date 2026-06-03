'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  Users,
  TrendingUp,
  ShoppingBag,
  Radio,
  Gavel,
  Sparkles,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigationStore } from '@/stores';
import {
  mockProducts,
  mockLiveStreams,
  mockAuctions,
  mockFeedItems,
  mockUsers,
} from '@/lib/mock-data';
import ProductCard from '@/components/shared/ProductCard';
import LiveCard from '@/components/shared/LiveCard';
import AuctionCard from '@/components/shared/AuctionCard';
import UserAvatar from '@/components/shared/UserAvatar';
import SkeletonGrid from '@/components/shared/SkeletonGrid';
import { Button } from '@/components/ui/button';
import LiveBadge from '@/components/shared/LiveBadge';
import type { FeedItem } from '@/types';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// HomeFeed — TikTok/Instagram Explore hybrid
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const liveStreams = mockLiveStreams.filter((s) => s.status === 'live');
const trendingProducts = mockProducts.slice(0, 4);
const popularSellers = mockUsers.slice(0, 5);

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
};

const sectionVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

// Section header component
function SectionHeader({
  icon,
  title,
  onSeeAll,
}: {
  icon: React.ReactNode;
  title: string;
  onSeeAll?: () => void;
}) {
  return (
    <div className="flex items-center justify-between px-1">
      <div className="flex items-center gap-2">
        <span className="flex items-center justify-center">{icon}</span>
        <h2 className="text-lg font-bold text-foreground sm:text-xl">{title}</h2>
      </div>
      {onSeeAll && (
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 text-xs font-semibold text-muted-foreground hover:text-primary"
          onClick={onSeeAll}
        >
          See All <ChevronRight size={14} />
        </Button>
      )}
    </div>
  );
}

// Masonry Feed Item renderer
function FeedItemCard({ item, index }: { item: FeedItem; index: number }) {
  if (item.type === 'product' && item.product) {
    return (
      <motion.div key={item.id} variants={itemVariants}>
        <ProductCard product={item.product} />
      </motion.div>
    );
  }
  if (item.type === 'live' && item.live) {
    return (
      <motion.div key={item.id} variants={itemVariants}>
        <LiveCard stream={item.live} />
      </motion.div>
    );
  }
  if (item.type === 'auction' && item.auction) {
    return (
      <motion.div key={item.id} variants={itemVariants}>
        <AuctionCard auction={item.auction} />
      </motion.div>
    );
  }
  return null;
}

// Pull-to-refresh indicator
function PullToRefreshIndicator({ refreshing }: { refreshing: boolean }) {
  return (
    <AnimatePresence>
      {refreshing && (
        <motion.div
          className="absolute top-0 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary backdrop-blur-sm"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 8 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <RefreshCw size={14} className="animate-spin" />
          Refreshing...
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function HomeFeed() {
  const navigate = useNavigationStore((s) => s.navigate);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number | null>(null);

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Pull-to-refresh simulation
  const handleTouchStart = (e: React.TouchEvent) => {
    if (scrollRef.current && scrollRef.current.scrollTop <= 0) {
      touchStartY.current = e.touches[0].clientY;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    if (deltaY > 80 && !isRefreshing) {
      setIsRefreshing(true);
      setTimeout(() => setIsRefreshing(false), 1500);
    }
    touchStartY.current = null;
  };

  if (isLoading) {
    return (
      <div className="space-y-8 px-4 py-6">
        {/* Hero skeletons */}
        <SkeletonGrid count={3} type="live" className="grid-cols-1" />
        <SkeletonGrid count={4} type="product" />
        <SkeletonGrid count={3} type="auction" />
        <SkeletonGrid count={6} type="product" />
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className="relative"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <PullToRefreshIndicator refreshing={isRefreshing} />

      <motion.div
        className="space-y-8 px-4 py-4 sm:px-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            HERO SECTION — Live Now Carousel
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <motion.section variants={sectionVariants} initial="hidden" animate="show">
          <div className="mb-3 flex items-center gap-2 px-1">
            <span className="text-xl">🔴</span>
            <h2 className="text-lg font-bold text-foreground sm:text-xl">
              Live Now
            </h2>
            <span className="ml-1 flex items-center gap-1 rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-600">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-rose-500 opacity-75" />
                <span className="relative inline-flex size-1.5 rounded-full bg-rose-500" />
              </span>
              {liveStreams.reduce((a, s) => a + s.viewerCount, 0).toLocaleString()} watching
            </span>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory scrollbar-hide">
            {liveStreams.map((stream, i) => (
              <motion.div
                key={stream.id}
                className="w-[82vw] shrink-0 snap-center sm:w-[45vw] md:w-[30vw] lg:w-[24vw]"
                variants={itemVariants}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 24,
                  delay: i * 0.12,
                }}
              >
                <div
                  className="relative cursor-pointer overflow-hidden rounded-2xl bg-muted shadow-lg"
                  onClick={() => navigate('live', { id: stream.id })}
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={stream.thumbnail}
                      alt={stream.title}
                      className="size-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Live badge */}
                    <div className="absolute top-3 left-3">
                      <LiveBadge viewerCount={stream.viewerCount} size="sm" />
                    </div>

                    {/* Viewer count pill */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-1 backdrop-blur-sm">
                      <Users size={12} className="text-white/80" />
                      <span className="text-[11px] font-semibold tabular-nums text-white">
                        {(stream.viewerCount / 1000).toFixed(1)}k
                      </span>
                    </div>

                    {/* Bottom content */}
                    <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <UserAvatar user={stream.seller} size="sm" />
                        <span className="text-xs font-semibold text-white drop-shadow-sm">
                          {stream.seller.displayName}
                        </span>
                        {stream.seller.isVerified && (
                          <span className="text-xs text-emerald-400">✓</span>
                        )}
                      </div>
                      <h3 className="line-clamp-2 text-sm font-bold leading-snug text-white drop-shadow-md sm:text-base">
                        {stream.title}
                      </h3>
                      <div className="mt-1.5 flex items-center gap-2">
                        <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-medium text-white/80">
                          {stream.category}
                        </span>
                        <span className="text-[10px] text-white/50">
                          {stream.products.length} items
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            TRENDING NOW — Product Cards
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <motion.section variants={sectionVariants} initial="hidden" animate="show">
          <div className="mb-3">
            <SectionHeader
              icon={<TrendingUp size={18} className="text-primary" />}
              title="Trending Now"
              onSeeAll={() => navigate('marketplace')}
            />
          </div>

          <motion.div
            className="flex gap-3 overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory scrollbar-hide"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {trendingProducts.map((product) => (
              <motion.div
                key={product.id}
                className="w-[40vw] shrink-0 snap-start sm:w-[28vw] md:w-[22vw]"
                variants={itemVariants}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            LIVE AUCTIONS — Auction Cards Grid
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <motion.section variants={sectionVariants} initial="hidden" animate="show">
          <div className="mb-3">
            <SectionHeader
              icon={<Gavel size={18} className="text-amber-500" />}
              title="Live Auctions"
              onSeeAll={() => navigate('marketplace')}
            />
          </div>

          <motion.div
            className="grid grid-cols-2 gap-3 md:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {mockAuctions.map((auction) => (
              <motion.div key={auction.id} variants={itemVariants}>
                <AuctionCard auction={auction} />
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            FOR YOU — AI Recommended Feed (Masonry)
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <motion.section variants={sectionVariants} initial="hidden" animate="show">
          <div className="mb-3 flex items-center gap-2 px-1">
            <Sparkles size={18} className="text-violet-500" />
            <h2 className="text-lg font-bold text-foreground sm:text-xl">
              For You
            </h2>
            <span className="rounded-full bg-violet-500/10 px-2 py-0.5 text-[10px] font-bold text-violet-600">
              AI Recommended
            </span>
          </div>

          {/* Masonry-style grid using CSS columns */}
          <motion.div
            className="columns-2 gap-3 space-y-3 md:columns-3 lg:columns-4"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {mockFeedItems.map((item, index) => (
              <div key={item.id} className="break-inside-avoid">
                <FeedItemCard item={item} index={index} />
              </div>
            ))}
          </motion.div>
        </motion.section>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            POPULAR SELLERS — Horizontal Row
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <motion.section variants={sectionVariants} initial="hidden" animate="show">
          <div className="mb-3">
            <SectionHeader
              icon={<ShoppingBag size={18} className="text-emerald-500" />}
              title="Popular Sellers"
              onSeeAll={() => navigate('marketplace')}
            />
          </div>

          <motion.div
            className="flex gap-3 overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory scrollbar-hide"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {popularSellers.map((seller) => (
              <motion.div
                key={seller.id}
                className="flex w-[72vw] shrink-0 snap-start items-center gap-3 rounded-xl border border-border/60 bg-card p-3 shadow-sm transition-shadow hover:shadow-md sm:w-[200px]"
                variants={itemVariants}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('seller-profile', { id: seller.id })}
              >
                <UserAvatar user={seller} size="lg" />
                <div className="flex flex-col gap-0.5 overflow-hidden">
                  <div className="flex items-center gap-1">
                    <span className="truncate text-sm font-semibold text-foreground">
                      {seller.displayName}
                    </span>
                    {seller.isVerified && (
                      <span className="shrink-0 text-xs text-emerald-500">✓</span>
                    )}
                  </div>
                  <span className="truncate text-xs text-muted-foreground">
                    @{seller.username}
                  </span>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span className="font-semibold text-amber-600">
                      ⭐ {seller.rating}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5">
                      <Users size={10} />
                      {seller.followersCount >= 1000
                        ? `${(seller.followersCount / 1000).toFixed(1)}k`
                        : seller.followersCount}{' '}
                      followers
                    </span>
                  </div>
                </div>
                <ArrowRight
                  size={16}
                  className="ml-auto shrink-0 text-muted-foreground/50"
                />
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            BOTTOM SPACER
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div className="h-8" />
      </motion.div>

      {/* Custom scrollbar hide utility */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
