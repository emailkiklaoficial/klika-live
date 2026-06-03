'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft, MapPin, Calendar, BadgeCheck, Star,
  Package, Radio, MessageCircle, Share2, UserPlus, UserMinus,
  Shield, TrendingUp, Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigationStore } from '@/stores';
import { mockUsers, mockProducts, mockLiveStreams } from '@/lib/mock-data';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import ProductCard from '@/components/shared/ProductCard';
import LiveCard from '@/components/shared/LiveCard';
import UserAvatar from '@/components/shared/UserAvatar';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SellerProfileView — Public seller profile
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

const mockReviews = [
  {
    id: 'sr1',
    user: mockUsers[2],
    rating: 5,
    text: 'Authentic product, fast shipping. Top notch seller!',
    date: '2024-12-04',
  },
  {
    id: 'sr2',
    user: mockUsers[3],
    rating: 5,
    text: 'Excellent communication and packaging. Would buy again.',
    date: '2024-12-01',
  },
  {
    id: 'sr3',
    user: mockUsers[4],
    rating: 4,
    text: 'Good quality item. Minor delay in shipping but overall great.',
    date: '2024-11-28',
  },
];

function formatCount(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}

export default function SellerProfileView() {
  const navigate = useNavigationStore((s) => s.navigate);
  const goBack = useNavigationStore((s) => s.goBack);
  const viewParams = useNavigationStore((s) => s.viewParams);

  const sellerId = viewParams.id || 'u1';
  const seller = mockUsers.find((u) => u.id === sellerId) || mockUsers[0];

  const sellerProducts = mockProducts.filter((p) => p.sellerId === seller.id);
  const sellerLives = mockLiveStreams.filter((l) => l.sellerId === seller.id);

  const [isFollowing, setIsFollowing] = useState(false);

  // AI Trust Score (simulated)
  const trustScore = Math.min(99, 85 + Math.round(seller.rating * 2));

  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: 'tween', ease: [0.32, 0.72, 0, 1], duration: 0.22 }}
      className="min-h-screen"
    >
      {/* ─── Back Button (overlay) ─── */}
      <div className="fixed top-14 left-0 z-30 pointer-events-none">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={goBack}
          className="pointer-events-auto m-3 flex items-center justify-center w-9 h-9 rounded-full glass shadow-sm"
          aria-label="Go back"
        >
          <ArrowLeft size={18} />
        </motion.button>
      </div>

      {/* ─── Cover ─── */}
      <div className="relative h-44 sm:h-56 bg-gradient-to-br from-primary/20 via-violet-500/15 to-emerald-500/10">
        {seller.coverImage && (
          <img
            src={seller.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-2xl mx-auto -mt-14 relative z-10"
      >
        {/* ─── Seller Info ─── */}
        <motion.div variants={item} className="px-4">
          <div className="flex items-end gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="ring-4 ring-background rounded-full"
            >
              <UserAvatar user={seller} size="xl" />
            </motion.div>
            <div className="pb-1 min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-foreground truncate">
                  {seller.displayName}
                </h1>
                {seller.isVerified && (
                  <div className="flex items-center gap-1">
                    <BadgeCheck size={16} className="text-emerald-500" />
                    <span className="text-[11px] font-semibold text-emerald-600">Verified</span>
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground">@{seller.username}</p>
            </div>
          </div>

          <p className="text-sm text-foreground/80 mt-3 max-w-lg leading-relaxed">
            {seller.bio}
          </p>

          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin size={12} />
              {seller.location}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              Joined {new Date(seller.joinedDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {seller.totalSales.toLocaleString()} sales
            </span>
          </div>
        </motion.div>

        {/* ─── Stats ─── */}
        <motion.div variants={item} className="px-4 mt-4">
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'Followers', value: seller.followersCount, icon: null },
              { label: 'Following', value: seller.followingCount, icon: null },
              { label: 'Rating', value: seller.rating, icon: Star, suffix: '★' },
              { label: 'Sales', value: seller.totalSales, icon: Package, suffix: '' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center rounded-xl bg-card border border-border/50 p-3"
              >
                <span className="font-mono text-lg font-bold text-foreground tabular-nums">
                  {typeof stat.value === 'number' && stat.value > 999
                    ? formatCount(stat.value)
                    : stat.value}
                  {stat.suffix}
                </span>
                <span className="text-[10px] font-medium text-muted-foreground mt-0.5">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ─── AI Trust Score ─── */}
        <motion.div variants={item} className="px-4 mt-4">
          <Card className="border-0 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500/8 via-emerald-500/5 to-transparent p-4">
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/20">
                  <span className="text-2xl font-black text-emerald-600 tabular-nums">{trustScore}</span>
                  <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-wider">Trust</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Shield size={14} className="text-emerald-500" />
                    <h3 className="text-sm font-bold text-foreground">AI Trust Score</h3>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Calculated from sales history, ratings, response time, and authenticity.
                    This seller is highly reliable.
                  </p>
                  {/* Trust bar */}
                  <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${trustScore}%` }}
                      transition={{ type: 'spring', stiffness: 300, damping: 24, delay: 0.3 }}
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* ─── Action Buttons ─── */}
        <motion.div variants={item} className="px-4 mt-4 flex gap-2">
          <motion.div whileTap={{ scale: 0.97 }} className="flex-1">
            <Button
              onClick={toggleFollow}
              className={cn(
                'w-full rounded-xl h-10 font-semibold text-sm',
                isFollowing
                  ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  : ''
              )}
              variant={isFollowing ? 'outline' : 'default'}
            >
              {isFollowing ? (
                <>
                  <UserMinus size={14} className="mr-1.5" />
                  Following
                </>
              ) : (
                <>
                  <UserPlus size={14} className="mr-1.5" />
                  Follow
                </>
              )}
            </Button>
          </motion.div>
          <motion.div whileTap={{ scale: 0.97 }} className="flex-1">
            <Button variant="outline" className="w-full rounded-xl h-10 font-semibold text-sm">
              <MessageCircle size={14} className="mr-1.5" />
              Message
            </Button>
          </motion.div>
          <motion.div whileTap={{ scale: 0.97 }}>
            <Button variant="outline" size="icon" className="rounded-xl w-10 h-10">
              <Share2 size={16} />
            </Button>
          </motion.div>
        </motion.div>

        {/* ─── Tabs ─── */}
        <motion.div variants={item} className="px-4 mt-6">
          <Tabs defaultValue="products" className="w-full">
            <TabsList className="w-full bg-muted/50 rounded-xl p-1 h-auto">
              <TabsTrigger
                value="products"
                className="flex-1 rounded-lg text-xs font-semibold data-[state=active]:bg-card data-[state=active]:shadow-sm py-2"
              >
                <Package size={13} className="mr-1" />
                Products ({sellerProducts.length})
              </TabsTrigger>
              <TabsTrigger
                value="lives"
                className="flex-1 rounded-lg text-xs font-semibold data-[state=active]:bg-card data-[state=active]:shadow-sm py-2"
              >
                <Radio size={13} className="mr-1" />
                Lives ({sellerLives.length})
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="flex-1 rounded-lg text-xs font-semibold data-[state=active]:bg-card data-[state=active]:shadow-sm py-2"
              >
                <Star size={13} className="mr-1" />
                Reviews
              </TabsTrigger>
            </TabsList>

            {/* Products Tab */}
            <TabsContent value="products" className="mt-4">
              {sellerProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {sellerProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center py-12 text-center">
                  <Package size={32} className="text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground mt-2">No products listed yet</p>
                </div>
              )}
            </TabsContent>

            {/* Lives Tab */}
            <TabsContent value="lives" className="mt-4">
              {sellerLives.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {sellerLives.map((stream) => (
                    <LiveCard key={stream.id} stream={stream} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center py-12 text-center">
                  <Radio size={32} className="text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground mt-2">No live streams yet</p>
                </div>
              )}
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="mt-4">
              {/* Rating Summary */}
              <Card className="border-0 shadow-sm p-4 mb-3">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center">
                    <span className="font-mono text-3xl font-black text-foreground">{seller.rating}</span>
                    <div className="flex items-center gap-0.5 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={cn(
                            i < Math.round(seller.rating)
                              ? 'text-amber-500 fill-amber-500'
                              : 'text-muted-foreground/30'
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-muted-foreground mt-0.5">
                      {seller.reviewCount} reviews
                    </span>
                  </div>
                  <div className="flex-1 space-y-1">
                    {[5, 4, 3, 2, 1].map((stars) => {
                      const percentage = stars === 5 ? 78 : stars === 4 ? 15 : stars === 3 ? 5 : stars === 2 ? 1 : 1;
                      return (
                        <div key={stars} className="flex items-center gap-2">
                          <span className="text-[10px] text-muted-foreground w-3">{stars}</span>
                          <Star size={10} className="text-amber-500 fill-amber-500" />
                          <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full rounded-full bg-amber-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-muted-foreground w-6 text-right tabular-nums">
                            {percentage}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Card>

              {/* Review List */}
              <div className="space-y-3">
                {mockReviews.map((review) => (
                  <motion.div
                    key={review.id}
                    whileHover={{ scale: 1.005 }}
                    className="rounded-xl bg-card border border-border/50 p-4"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <UserAvatar user={review.user} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {review.user.displayName}
                        </p>
                        <p className="text-[10px] text-muted-foreground">{review.date}</p>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={11}
                            className={cn(
                              i < review.rating
                                ? 'text-amber-500 fill-amber-500'
                                : 'text-muted-foreground/30'
                            )}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed">{review.text}</p>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        <div className="h-8" />
      </motion.div>
    </motion.div>
  );
}
