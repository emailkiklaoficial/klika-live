'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gavel,
  Eye,
  Clock,
  TrendingUp,
  Package,
  Truck,
  Shield,
  Star,
  Bell,
  BellOff,
  Check,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Users,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useAuctionStore, useNavigationStore } from '@/stores';
import { mockAuctions } from '@/lib/mock-data';
import type { Auction, Bid } from '@/types';
import CountdownTimer from '@/components/shared/CountdownTimer';
import PriceDisplay from '@/components/shared/PriceDisplay';
import UserAvatar from '@/components/shared/UserAvatar';

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Animation Variants
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const fadeInUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

const slideDownFlash = {
  initial: { opacity: 0, y: -20, scale: 0.95, backgroundColor: 'rgba(255,255,255,0)' },
  animate: { opacity: 1, y: 0, scale: 1, backgroundColor: 'rgba(244,63,94,0.06)' },
  exit: { opacity: 0, y: 20, scale: 0.98 },
};

const bidConfirm = {
  initial: { scale: 0, opacity: 0 },
  animate: {
    scale: [0, 1.2, 1],
    opacity: [0, 1, 1],
  },
  exit: { scale: 1.3, opacity: 0 },
};

const pulseGlow = {
  animate: {
    boxShadow: [
      '0 0 0 0 rgba(244,63,94,0.4)',
      '0 0 0 8px rgba(244,63,94,0)',
      '0 0 0 0 rgba(244,63,94,0)',
    ],
  },
  transition: {
    duration: 1.5,
    repeat: Infinity,
  },
};

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Helpers
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function formatBidTime(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const secs = Math.floor(diff / 1000);
  if (secs < 60) return 'just now';
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ago`;
}

function getRemainingMs(endsAt: string): number {
  return Math.max(0, new Date(endsAt).getTime() - Date.now());
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Bid Confirmation Overlay
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

interface BidConfirmProps {
  amount: number;
  show: boolean;
  onClose: () => void;
}

function BidConfirmation({ amount, show, onClose }: BidConfirmProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 2500);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          variants={bidConfirm}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
        >
          <div className="flex flex-col items-center gap-2">
            <motion.div
              className="flex items-center justify-center size-16 sm:size-20 rounded-full bg-emerald-500 shadow-xl shadow-emerald-500/30"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: 2, duration: 0.4 }}
            >
              <Check className="size-8 sm:size-10 text-white" strokeWidth={3} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-2xl px-6 py-3 text-center shadow-xl"
            >
              <p className="text-xs font-medium text-muted-foreground">Bid Placed</p>
              <p className="text-xl sm:text-2xl font-extrabold text-foreground font-mono tabular-nums">
                ${amount.toLocaleString()}
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Bid History Item
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

interface BidHistoryItemProps {
  bid: Bid;
  isNew?: boolean;
}

function BidHistoryItem({ bid, isNew }: BidHistoryItemProps) {
  return (
    <motion.div
      layout
      variants={isNew ? slideDownFlash : undefined}
      initial={isNew ? 'initial' : undefined}
      animate="animate"
      exit="exit"
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
        bid.isHighest
          ? 'bg-primary/8 border border-primary/15'
          : 'hover:bg-muted/50'
      )}
    >
      <UserAvatar user={bid.user} size="sm" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-xs font-semibold text-foreground truncate">
            {bid.user.displayName}
          </p>
          {bid.isHighest && (
            <Badge className="text-[8px] px-1 py-px bg-primary text-primary-foreground border-0">
              Highest
            </Badge>
          )}
        </div>
        <p className="text-[10px] text-muted-foreground">{formatBidTime(bid.timestamp)}</p>
      </div>
      <p
        className={cn(
          'text-sm font-bold font-mono tabular-nums',
          bid.isHighest ? 'text-primary' : 'text-foreground'
        )}
      >
        ${bid.amount.toLocaleString()}
      </p>
    </motion.div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   AuctionView — Main Component
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export default function AuctionView() {
  const auction = mockAuctions[0];

  /* ─── Stores ─── */
  const setAuction = useAuctionStore((s) => s.setAuction);
  const bids = useAuctionStore((s) => s.bids);
  const addBid = useAuctionStore((s) => s.addBid);
  const userBid = useAuctionStore((s) => s.userBid);
  const placeBid = useAuctionStore((s) => s.placeBid);

  /* ─── Local State ─── */
  const [customBid, setCustomBid] = useState('');
  const [bidConfirmShow, setBidConfirmShow] = useState(false);
  const [bidConfirmAmount, setBidConfirmAmount] = useState(0);
  const [newBidIds, setNewBidIds] = useState<Set<string>>(new Set());
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [isWatched, setIsWatched] = useState(auction.isWatched);
  const bidHistoryRef = useRef<HTMLDivElement>(null);
  const competingBidTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ─── Derived values ─── */
  const currentHighestBid = bids.length > 0 ? bids[0].amount : auction.currentBid;
  const reserveMet = auction.reservePrice ? currentHighestBid >= auction.reservePrice : true;
  const isUrgent = getRemainingMs(auction.endsAt) < 5 * 60 * 1000 && getRemainingMs(auction.endsAt) > 0;
  const isEndingSoon = getRemainingMs(auction.endsAt) < 60 * 60 * 1000 && getRemainingMs(auction.endsAt) > 0;

  /* ─── Initialize store ─── */
  useEffect(() => {
    setAuction(auction);
  }, []);

  /* ─── Auto-scroll bid history ─── */
  useEffect(() => {
    bidHistoryRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [bids]);

  /* ─── Cleanup competing bid timer ─── */
  useEffect(() => {
    return () => {
      if (competingBidTimerRef.current) clearTimeout(competingBidTimerRef.current);
    };
  }, []);

  /* ─── Handle placing a bid ─── */
  const handlePlaceBid = useCallback(
    (amount: number) => {
      const roundedAmount = Math.round(amount);
      if (roundedAmount <= currentHighestBid) return;

      // Optimistic UI: immediately add our bid
      const myBid: Bid = {
        id: `my-bid-${Date.now()}`,
        userId: 'current-user',
        user: {
          id: 'current-user',
          username: 'you',
          displayName: 'You',
          avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=you',
        },
        amount: roundedAmount,
        timestamp: new Date().toISOString(),
        isHighest: true,
      };

      // Mark previous highest as not highest
      const updatedBids = bids.map((b) =>
        b.isHighest ? { ...b, isHighest: false } : b
      );
      updatedBids.unshift(myBid);
      addBid(myBid);

      placeBid(roundedAmount);
      setBidConfirmAmount(roundedAmount);
      setBidConfirmShow(true);

      // Track new bid
      setNewBidIds((prev) => new Set(prev).add(myBid.id));
      setTimeout(() => {
        setNewBidIds((prev) => {
          const next = new Set(prev);
          next.delete(myBid.id);
          return next;
        });
      }, 2000);

      // Simulate competing bid after 2s
      if (competingBidTimerRef.current) clearTimeout(competingBidTimerRef.current);
      competingBidTimerRef.current = setTimeout(() => {
        const competitors = [
          { username: 'speed_bidder', displayName: 'SpeedBidder', seed: 'speedbidder' },
          { username: 'collector_elite', displayName: 'CollectorElite', seed: 'collectorelite' },
          { username: 'bid_wolf', displayName: 'BidWolf', seed: 'bidwolf' },
        ];
        const competitor = competitors[Math.floor(Math.random() * competitors.length)];
        const increment = [50, 100, 200][Math.floor(Math.random() * 3)];
        const competingAmount = roundedAmount + increment;

        const compBid: Bid = {
          id: `comp-bid-${Date.now()}`,
          userId: `user-${Date.now()}`,
          user: {
            id: `user-${Date.now()}`,
            username: competitor.username,
            displayName: competitor.displayName,
            avatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=${competitor.seed}`,
          },
          amount: competingAmount,
          timestamp: new Date().toISOString(),
          isHighest: true,
        };

        addBid(compBid);
        setNewBidIds((prev) => new Set(prev).add(compBid.id));
        setTimeout(() => {
          setNewBidIds((prev) => {
            const next = new Set(prev);
            next.delete(compBid.id);
            return next;
          });
        }, 2000);
      }, 2000);
    },
    [currentHighestBid, bids, addBid, placeBid]
  );

  /* ─── Quick bid handler ─── */
  const handleQuickBid = useCallback(
    (increment: number) => {
      handlePlaceBid(currentHighestBid + increment);
    },
    [currentHighestBid, handlePlaceBid]
  );

  /* ─── Custom bid submit ─── */
  const handleCustomBidSubmit = useCallback(() => {
    const val = parseFloat(customBid.replace(/[^0-9.]/g, ''));
    if (val && val > currentHighestBid) {
      handlePlaceBid(val);
      setCustomBid('');
    }
  }, [customBid, currentHighestBid, handlePlaceBid]);

  /* ─── No auction fallback ─── */
  if (!auction) return null;

  return (
    <div className="relative min-h-[calc(100vh-5.5rem)] pb-24 bg-background">
      {/* Bid Confirmation Overlay */}
      <BidConfirmation
        amount={bidConfirmAmount}
        show={bidConfirmShow}
        onClose={() => setBidConfirmShow(false)}
      />

      {/* ═══════════════════════════════════════════════════════════════════════
         HERO SECTION — Product Image + LIVE AUCTION Badge
         ═══════════════════════════════════════════════════════════════════════ */}
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        className="relative w-full aspect-[4/3] sm:aspect-video max-h-[50vh] bg-black overflow-hidden"
      >
        <img
          src={auction.images[0]}
          alt={auction.title}
          className="w-full h-full object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* LIVE AUCTION Badge */}
        <motion.div
          variants={pulseGlow}
          animate="animate"
          className="absolute top-3 left-3 flex items-center gap-2"
        >
          <div className="flex items-center gap-1.5 rounded-full bg-rose-500 px-3 py-1.5 shadow-lg shadow-rose-500/30">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-white opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-white" />
            </span>
            <span className="text-[11px] font-black uppercase tracking-wider text-white">
              Live Auction
            </span>
          </div>
        </motion.div>

        {/* Watchers count */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full glass px-2.5 py-1.5">
          <Eye size={12} className="text-white/80" />
          <span className="text-[11px] font-semibold text-white/90 tabular-nums">
            {auction.watchCount.toLocaleString()}
          </span>
        </div>

        {/* Title overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h1 className="text-lg sm:text-xl font-bold text-white leading-tight line-clamp-2">
            {auction.title}
          </h1>
          <div className="flex items-center gap-2 mt-1.5">
            <UserAvatar user={auction.seller} size="sm" />
            <span className="text-xs text-white/80">{auction.seller.displayName}</span>
            {auction.seller.isVerified && (
              <Star className="size-3 text-amber-400 fill-amber-400" />
            )}
          </div>
        </div>
      </motion.div>

      <div className="max-w-screen-md mx-auto px-3 sm:px-4 space-y-4 -mt-2 relative z-10">
        {/* ═══════════════════════════════════════════════════════════════════════
           COUNTDOWN TIMER
           ═══════════════════════════════════════════════════════════════════════ */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.1 }}
          className={cn(
            'flex items-center justify-center rounded-xl p-4 sm:p-5',
            isUrgent
              ? 'bg-rose-50 border-2 border-rose-300 shadow-lg shadow-rose-200/30'
              : isEndingSoon
                ? 'bg-amber-50 border border-amber-200'
                : 'bg-card border border-border'
          )}
        >
          <div className="text-center">
            {isUrgent && (
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="flex items-center justify-center gap-1 mb-1.5"
              >
                <Zap size={14} className="text-rose-500" />
                <span className="text-xs font-black uppercase tracking-wider text-rose-600">
                  HURRY!
                </span>
                <Zap size={14} className="text-rose-500" />
              </motion.div>
            )}
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
              Time Remaining
            </p>
            <CountdownTimer targetDate={auction.endsAt} />
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════════════
           CURRENT BID DISPLAY
           ═══════════════════════════════════════════════════════════════════════ */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.15 }}
          className="text-center space-y-2"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Current Bid
          </p>
          <motion.p
            key={currentHighestBid}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-3xl sm:text-4xl font-extrabold text-primary font-mono tabular-nums"
          >
            ${currentHighestBid.toLocaleString()}
          </motion.p>
          <div className="flex items-center justify-center gap-3 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Gavel size={11} />
              {auction.bidCount} bids
            </span>
            <span className="flex items-center gap-1">
              <Users size={11} />
              {auction.bidderCount} bidders
            </span>
            <TrendingUp size={11} className="text-emerald-500" />
          </div>
          {!reserveMet && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-1.5 text-amber-600"
            >
              <AlertTriangle size={13} />
              <span className="text-xs font-semibold">Reserve not met</span>
            </motion.div>
          )}
          {userBid && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center gap-1.5"
            >
              <span className="text-[11px] text-muted-foreground">Your bid:</span>
              <span className="text-[11px] font-bold text-foreground font-mono tabular-nums">
                ${userBid.toLocaleString()}
              </span>
              {!bids[0]?.isHighest && bids[0]?.userId === 'current-user' ? null : bids.find((b) => b.userId === 'current-user')?.isHighest ? (
                <Badge className="text-[8px] px-1.5 py-0 bg-emerald-500 text-white border-0">
                  Leading
                </Badge>
              ) : (
                <Badge className="text-[8px] px-1.5 py-0 bg-amber-500 text-white border-0">
                  Outbid
                </Badge>
              )}
            </motion.div>
          )}
        </motion.div>

        <Separator />

        {/* ═══════════════════════════════════════════════════════════════════════
           BID PANEL — The Most Interactive Part
           ═══════════════════════════════════════════════════════════════════════ */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <Gavel size={16} className="text-primary" />
            Place Your Bid
          </h2>

          {/* Quick Bid Buttons */}
          <div className="grid grid-cols-3 gap-2">
            {[100, 500, 1000].map((increment) => (
              <motion.button
                key={increment}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.03 }}
                onClick={() => handleQuickBid(increment)}
                className="flex flex-col items-center justify-center gap-0.5 rounded-xl border-2 border-border bg-card hover:border-primary/40 hover:bg-primary/5 transition-colors py-3"
              >
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  +${increment}
                </span>
                <span className="text-sm font-bold text-foreground font-mono tabular-nums">
                  ${(currentHighestBid + increment).toLocaleString()}
                </span>
              </motion.button>
            ))}
          </div>

          {/* Custom Bid Input */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">
                $
              </span>
              <input
                type="number"
                value={customBid}
                onChange={(e) => setCustomBid(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCustomBidSubmit();
                }}
                placeholder={`${(currentHighestBid + 1).toLocaleString()} or more`}
                min={currentHighestBid + 1}
                className="w-full h-11 rounded-xl bg-muted pl-7 pr-3 text-sm font-semibold text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-primary/20 border-2 border-transparent focus:border-primary/30 transition-all font-mono tabular-nums"
              />
            </div>
            <Button
              onClick={handleCustomBidSubmit}
              disabled={!customBid || parseFloat(customBid) <= currentHighestBid}
              size="lg"
              className="h-11 px-6 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-lg shadow-primary/20 disabled:opacity-40"
            >
              <Gavel size={16} className="mr-1.5" />
              Bid
            </Button>
          </div>

          {/* BID NOW Primary Button */}
          <motion.div whileTap={{ scale: 0.98 }}>
            <Button
              size="lg"
              onClick={() => handleQuickBid(100)}
              className={cn(
                'w-full h-14 text-base font-extrabold rounded-xl shadow-xl',
                isUrgent
                  ? 'bg-rose-500 text-white hover:bg-rose-600 shadow-rose-500/30'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/25'
              )}
            >
              <Gavel size={20} className="mr-2" />
              BID NOW — ${(currentHighestBid + 100).toLocaleString()}
            </Button>
          </motion.div>

          {/* Buy Now (if available) */}
          {auction.buyNowPrice && (
            <Button
              variant="outline"
              size="lg"
              className="w-full h-12 rounded-xl border-2 border-dashed border-border text-foreground hover:bg-muted transition-colors"
            >
              <span className="text-xs text-muted-foreground mr-1.5">Buy Now</span>
              <span className="font-bold font-mono tabular-nums">
                ${auction.buyNowPrice.toLocaleString()}
              </span>
            </Button>
          )}
        </motion.div>

        <Separator />

        {/* ═══════════════════════════════════════════════════════════════════════
           BID HISTORY FEED
           ═══════════════════════════════════════════════════════════════════════ */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.25 }}
          className="space-y-2"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <TrendingUp size={16} className="text-primary" />
              Bid History
            </h2>
            <Badge variant="secondary" className="text-[10px]">
              {bids.length} bids
            </Badge>
          </div>

          <div
            ref={bidHistoryRef}
            className="max-h-64 overflow-y-auto space-y-1 rounded-xl border border-border bg-card/50"
          >
            <AnimatePresence initial={false}>
              {bids.slice(0, 20).map((bid) => (
                <BidHistoryItem
                  key={bid.id}
                  bid={bid}
                  isNew={newBidIds.has(bid.id)}
                />
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        <Separator />

        {/* ═══════════════════════════════════════════════════════════════════════
           PRODUCT DETAILS
           ═══════════════════════════════════════════════════════════════════════ */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <Package size={16} className="text-primary" />
            Product Details
          </h2>

          {/* Description (expandable) */}
          <div
            className={cn(
              'text-sm text-muted-foreground leading-relaxed transition-all',
              !descriptionExpanded && 'line-clamp-3'
            )}
          >
            {auction.description}
          </div>
          <button
            onClick={() => setDescriptionExpanded(!descriptionExpanded)}
            className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            {descriptionExpanded ? (
              <>
                Show less <ChevronUp size={12} />
              </>
            ) : (
              <>
                Read more <ChevronDown size={12} />
              </>
            )}
          </button>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {auction.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-[10px]">
                {tag}
              </Badge>
            ))}
          </div>

          <Separator />

          {/* ─── Seller Info Card ─── */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border">
            <UserAvatar user={auction.seller} size="lg" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-bold text-foreground truncate">
                  {auction.seller.displayName}
                </p>
                {auction.seller.isVerified && (
                  <Shield size={12} className="text-emerald-500" />
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="flex items-center gap-0.5">
                  <Star size={10} className="text-amber-400 fill-amber-400" />
                  <span className="text-[11px] font-semibold text-foreground">
                    {auction.seller.rating}
                  </span>
                </div>
                <span className="text-[11px] text-muted-foreground">•</span>
                <span className="text-[11px] text-muted-foreground">
                  {auction.seller.reviewCount} reviews
                </span>
              </div>
            </div>
            <Button variant="outline" size="sm" className="h-8 text-[11px] rounded-lg">
              View Profile
            </Button>
          </div>

          {/* ─── Shipping Info ─── */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border">
            <div className="flex items-center justify-center size-9 rounded-lg bg-primary/10">
              <Truck size={16} className="text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-foreground">Free Shipping</p>
              <p className="text-[11px] text-muted-foreground">
                Estimated 5-7 business days
              </p>
            </div>
          </div>

          {/* ─── Watch / Unwatch ─── */}
          <motion.div whileTap={{ scale: 0.97 }}>
            <Button
              variant={isWatched ? 'secondary' : 'outline'}
              size="lg"
              onClick={() => setIsWatched(!isWatched)}
              className={cn(
                'w-full h-11 rounded-xl font-semibold transition-colors',
                isWatched && 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/15'
              )}
            >
              {isWatched ? (
                <>
                  <BellOff size={16} className="mr-2" />
                  Watching ({auction.watchCount.toLocaleString()})
                </>
              ) : (
                <>
                  <Bell size={16} className="mr-2" />
                  Watch This Auction
                </>
              )}
            </Button>
          </motion.div>
        </motion.div>

        {/* Bottom spacer for sticky bar */}
        <div className="h-20" />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
         BOTTOM STICKY BAR — Bid Summary + CTA
         ═══════════════════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed bottom-16 sm:bottom-2 left-0 right-0 z-40"
      >
        <div className="max-w-screen-md mx-auto px-3 sm:px-4">
          <div className="glass rounded-2xl border border-border shadow-2xl p-3 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Current Bid
              </p>
              <div className="flex items-center gap-2">
                <span className="text-lg font-extrabold text-primary font-mono tabular-nums">
                  ${currentHighestBid.toLocaleString()}
                </span>
                <CountdownTimer targetDate={auction.endsAt} compact />
              </div>
            </div>
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => handleQuickBid(100)}
                size="lg"
                className={cn(
                  'h-12 px-6 rounded-xl font-extrabold shadow-lg',
                  isUrgent
                    ? 'bg-rose-500 text-white hover:bg-rose-600 shadow-rose-500/30'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20'
                )}
              >
                BID NOW
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
