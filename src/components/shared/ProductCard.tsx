'use client';

import { motion } from 'framer-motion';
import { Heart, Eye } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Product } from '@/types';
import { useNavigationStore } from '@/stores';
import UserAvatar from '@/components/shared/UserAvatar';
import PriceDisplay from '@/components/shared/PriceDisplay';
import CountdownTimer from '@/components/shared/CountdownTimer';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ProductCard — TikTok / Instagram shopping card
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const navigate = useNavigationStore((s) => s.navigate);

  const handleClick = () => {
    navigate('product-detail', { id: product.id });
  };

  return (
    <motion.div
      className={cn('flex flex-col', className)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <Card
        className="cursor-pointer overflow-hidden gap-0 rounded-xl border-0 p-0 shadow-md hover:shadow-xl transition-shadow"
        onClick={handleClick}
      >
        {/* ─── Image Container ─── */}
        <div className="relative aspect-square overflow-hidden rounded-t-xl bg-muted">
          <img
            src={product.images[0]}
            alt={product.title}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {/* Like button */}
          <motion.button
            className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-full bg-black/40 px-2 py-1 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
            onClick={(e) => {
              e.stopPropagation();
            }}
            whileTap={{ scale: 0.9 }}
          >
            <Heart
              size={14}
              className={cn(
                product.isLiked ? 'fill-rose-500 text-rose-500' : 'text-white'
              )}
            />
            {product.likesCount > 0 && (
              <span className="text-[10px] font-semibold tabular-nums">
                {product.likesCount >= 1000
                  ? `${(product.likesCount / 1000).toFixed(1)}k`
                  : product.likesCount}
              </span>
            )}
          </motion.button>

          {/* Auction overlay */}
          {product.isAuction && (
            <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
              <span className="rounded-full bg-rose-500 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow-lg shadow-rose-500/30">
                🔴 LIVE AUCTION
              </span>
              {product.auctionEndsAt && (
                <CountdownTimer
                  targetDate={product.auctionEndsAt}
                  compact
                />
              )}
            </div>
          )}

          {/* Bid info for auction */}
          {product.isAuction && product.currentBid != null && product.bidCount != null && (
            <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between rounded-lg bg-black/60 px-2.5 py-1.5 backdrop-blur-sm">
              <div>
                <span className="text-[9px] font-medium uppercase tracking-wider text-white/60">Current Bid</span>
                <div className="font-mono text-sm font-bold text-rose-400 tabular-nums">
                  ${product.currentBid.toLocaleString()}
                </div>
              </div>
              <div className="flex items-center gap-1 text-white/70">
                <Eye size={10} />
                <span className="text-[10px] font-medium tabular-nums">
                  {product.bidCount} bids
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ─── Content ─── */}
        <div className="flex flex-col gap-2 p-3 sm:p-3.5">
          {/* Title — 2-line clamp */}
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground sm:text-[15px]">
            {product.title}
          </h3>

          {/* Price */}
          <PriceDisplay
            price={product.price}
            originalPrice={product.originalPrice}
            currency={product.currency}
            size="sm"
          />

          {/* Seller row */}
          <div className="flex items-center gap-2 pt-0.5">
            <UserAvatar user={product.seller} size="sm" />
            <span className="truncate text-xs font-medium text-muted-foreground">
              {product.seller.displayName}
            </span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
