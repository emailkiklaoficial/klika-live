'use client';

import { motion } from 'framer-motion';
import { Eye, Gavel, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Auction } from '@/types';
import { useNavigationStore } from '@/stores';
import UserAvatar from '@/components/shared/UserAvatar';
import PriceDisplay from '@/components/shared/PriceDisplay';
import CountdownTimer from '@/components/shared/CountdownTimer';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// AuctionCard — Auction listing with urgency
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface AuctionCardProps {
  auction: Auction;
  className?: string;
}

export default function AuctionCard({ auction, className }: AuctionCardProps) {
  const navigate = useNavigationStore((s) => s.navigate);

  const handleClick = () => {
    if (auction.status !== 'ended' && auction.status !== 'sold') {
      navigate('auction', { id: auction.id });
    }
  };

  const isEnded = auction.status === 'ended' || auction.status === 'sold';
  const isLive = auction.status === 'live';

  return (
    <motion.div
      className={cn('flex flex-col', className)}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      whileHover={isEnded ? {} : { scale: 1.02 }}
      whileTap={isEnded ? {} : { scale: 0.98 }}
    >
      <div
        className={cn(
          'relative cursor-pointer overflow-hidden rounded-xl border border-border/60 bg-card shadow-md transition-shadow hover:shadow-xl',
          isEnded && 'cursor-default opacity-70'
        )}
        onClick={handleClick}
      >
        {/* ─── Image Container ─── */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={auction.images[0]}
            alt={auction.title}
            className="size-full object-cover transition-transform duration-500"
            loading="lazy"
          />

          {/* AUCTION badge */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
            <motion.span
              className={cn(
                'rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow-lg',
                isLive
                  ? 'bg-rose-500 shadow-rose-500/30'
                  : isEnded
                    ? 'bg-muted-foreground'
                    : 'bg-amber-500 shadow-amber-500/30'
              )}
              animate={isLive ? { scale: [1, 1.04, 1] } : {}}
              transition={isLive ? { repeat: Infinity, duration: 2 } : {}}
            >
              {isEnded ? (auction.status === 'sold' ? 'SOLD' : 'ENDED') : isLive ? '🔴 AUCTION LIVE' : 'UPCOMING'}
            </motion.span>
          </div>

          {/* ─── SOLD overlay ─── */}
          {auction.status === 'sold' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[2px]">
              <motion.span
                className="rounded-xl bg-rose-600 px-6 py-3 text-2xl font-black uppercase tracking-widest text-white shadow-2xl"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
              >
                SOLD
              </motion.span>
            </div>
          )}

          {/* ─── Watcher count ─── */}
          {isLive && (
            <div className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-full bg-black/40 px-2 py-1 backdrop-blur-sm">
              <Users size={10} className="text-white/70" />
              <span className="text-[10px] font-medium tabular-nums text-white/80">
                {auction.watchCount >= 1000
                  ? `${(auction.watchCount / 1000).toFixed(1)}k`
                  : auction.watchCount}
              </span>
            </div>
          )}
        </div>

        {/* ─── Content ─── */}
        <div className="flex flex-col gap-2.5 p-3 sm:p-4">
          {/* Title */}
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground sm:text-[15px]">
            {auction.title}
          </h3>

          {/* Countdown */}
          {!isEnded && (
            <CountdownTimer targetDate={auction.endsAt} compact={false} />
          )}

          {/* Current bid — large and bold */}
          <div className="flex items-end justify-between">
            <div>
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                {isEnded ? 'Final Bid' : 'Current Bid'}
              </span>
              <PriceDisplay
                price={auction.currentBid}
                size="lg"
                showBadge={false}
              />
            </div>
            {auction.buyNowPrice && !isEnded && (
              <div className="text-right">
                <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Buy Now
                </span>
                <div className="font-mono text-sm font-bold text-foreground tabular-nums">
                  ${auction.buyNowPrice.toLocaleString()}
                </div>
              </div>
            )}
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Gavel size={12} />
              <span className="font-medium tabular-nums">{auction.bidCount} bids</span>
            </span>
            <span className="flex items-center gap-1">
              <Users size={12} />
              <span className="font-medium tabular-nums">{auction.bidderCount} bidders</span>
            </span>
            <span className="flex items-center gap-1">
              <Eye size={12} />
              <span className="font-medium tabular-nums">{auction.watchCount} watching</span>
            </span>
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-border/60" />

          {/* Seller row */}
          <div
            className="flex items-center gap-2"
            onClick={(e) => {
              e.stopPropagation();
              navigate('seller-profile', { id: auction.seller.id });
            }}
          >
            <UserAvatar user={auction.seller} size="sm" />
            <span className="truncate text-xs font-medium text-muted-foreground">
              {auction.seller.displayName}
            </span>
            {auction.seller.rating && (
              <span className="ml-auto text-[10px] font-semibold text-amber-600">
                ⭐ {auction.seller.rating}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
