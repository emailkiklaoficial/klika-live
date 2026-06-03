'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LogIn, MapPin, Calendar, Edit3, Share2, Settings,
  Package, Star, Radio, Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigationStore, useAuthStore } from '@/stores';
import { mockUsers, mockProducts, mockLiveStreams } from '@/lib/mock-data';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import ProductCard from '@/components/shared/ProductCard';
import LiveCard from '@/components/shared/LiveCard';
import UserAvatar from '@/components/shared/UserAvatar';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ProfileView — User profile
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

/* Mock reviews for demo */
const mockReviews = [
  {
    id: 'r1',
    user: mockUsers[2],
    rating: 5,
    text: 'Amazing product! Exactly as described. Fast shipping and great communication.',
    date: '2024-12-04',
  },
  {
    id: 'r2',
    user: mockUsers[3],
    rating: 4,
    text: 'Very good quality. Would buy again from this seller.',
    date: '2024-12-02',
  },
  {
    id: 'r3',
    user: mockUsers[4],
    rating: 5,
    text: 'Exceptional service and authentic product. Highly recommended!',
    date: '2024-11-28',
  },
];

function formatCount(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}

export default function ProfileView() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = mockUsers[0]; // Demo user
  const navigate = useNavigationStore((s) => s.navigate);

  const userProducts = mockProducts.filter((p) => p.sellerId === user.id);
  const userLives = mockLiveStreams.filter((l) => l.sellerId === user.id);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: 'tween', ease: [0.32, 0.72, 0, 1], duration: 0.22 }}
      className="min-h-screen"
    >
      <AnimatePresence mode="wait">
        {/* ═══════════════════════════════════════════════════════════════════
            Not Authenticated — Login Prompt
            ═══════════════════════════════════════════════════════════════════ */}
        {!isAuthenticated && (
          <motion.div
            key="login-prompt"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-center min-h-[70vh] gap-5 px-4"
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10"
            >
              <LogIn size={32} className="text-primary" />
            </motion.div>

            <div className="text-center max-w-sm">
              <h2 className="text-xl font-bold text-foreground">Sign in to see your profile</h2>
              <p className="text-sm text-muted-foreground mt-2">
                Access your listings, orders, analytics, and connect with the community.
              </p>
            </div>

            <Button
              onClick={() => navigate('auth-login')}
              className="rounded-xl font-semibold px-8"
              size="lg"
            >
              <LogIn size={16} className="mr-2" />
              Sign In
            </Button>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            Authenticated — Profile View
            ═══════════════════════════════════════════════════════════════════ */}
        {isAuthenticated && (
          <motion.div
            key="profile-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* ─── Cover Image ─── */}
            <div className="relative h-36 sm:h-48 bg-gradient-to-br from-primary/20 via-violet-500/15 to-primary/10">
              {user.coverImage && (
                <img
                  src={user.coverImage}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />

              {/* Settings icon */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="absolute top-4 right-4 flex items-center justify-center w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-colors"
                aria-label="Settings"
              >
                <Settings size={18} className="text-white" />
              </motion.button>
            </div>

            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="max-w-2xl mx-auto"
            >
              {/* ─── Profile Info ─── */}
              <motion.div variants={item} className="px-4 -mt-12 relative z-10">
                <div className="flex items-end gap-4">
                  <UserAvatar user={user} size="xl" />
                  <div className="pb-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h1 className="text-xl font-bold text-foreground truncate">
                        {user.displayName}
                      </h1>
                      {user.isVerified && (
                        <Badge className="bg-emerald-500/10 text-emerald-600 border-0 text-[10px] font-bold">
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">@{user.username}</p>
                  </div>
                </div>

                <p className="text-sm text-foreground/80 mt-3 max-w-lg">
                  {user.bio}
                </p>

                {/* Location & Joined */}
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin size={12} />
                    {user.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    Joined {new Date(user.joinedDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star size={12} className="text-amber-500 fill-amber-500" />
                    {user.rating} ({user.reviewCount} reviews)
                  </span>
                </div>
              </motion.div>

              {/* ─── Stats Row ─── */}
              <motion.div variants={item} className="px-4 mt-4">
                <div className="flex items-center justify-around rounded-2xl bg-card border border-border/50 p-4 shadow-sm">
                  {[
                    { label: 'Posts', value: userProducts.length + userLives.length },
                    { label: 'Followers', value: user.followersCount },
                    { label: 'Following', value: user.followingCount },
                  ].map((stat) => (
                    <motion.button
                      key={stat.label}
                      whileTap={{ scale: 0.95 }}
                      className="flex flex-col items-center gap-0.5"
                    >
                      <span className="font-mono text-lg font-bold text-foreground tabular-nums">
                        {formatCount(stat.value)}
                      </span>
                      <span className="text-[11px] font-medium text-muted-foreground">
                        {stat.label}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* ─── Action Buttons ─── */}
              <motion.div variants={item} className="px-4 mt-4 flex gap-3">
                <motion.div whileTap={{ scale: 0.97 }} className="flex-1">
                  <Button variant="outline" className="w-full rounded-xl font-semibold h-10">
                    <Edit3 size={14} className="mr-1.5" />
                    Edit Profile
                  </Button>
                </motion.div>
                <motion.div whileTap={{ scale: 0.97 }} className="flex-1">
                  <Button variant="outline" className="w-full rounded-xl font-semibold h-10">
                    <Share2 size={14} className="mr-1.5" />
                    Share Profile
                  </Button>
                </motion.div>
              </motion.div>

              {/* ─── Tabs ─── */}
              <motion.div variants={item} className="px-4 mt-6">
                <Tabs defaultValue="listings" className="w-full">
                  <TabsList className="w-full bg-muted/50 rounded-xl p-1 h-auto">
                    <TabsTrigger
                      value="listings"
                      className="flex-1 rounded-lg text-xs font-semibold data-[state=active]:bg-card data-[state=active]:shadow-sm py-2"
                    >
                      <Package size={13} className="mr-1" />
                      Listings
                    </TabsTrigger>
                    <TabsTrigger
                      value="reviews"
                      className="flex-1 rounded-lg text-xs font-semibold data-[state=active]:bg-card data-[state=active]:shadow-sm py-2"
                    >
                      <Star size={13} className="mr-1" />
                      Reviews
                    </TabsTrigger>
                    <TabsTrigger
                      value="lives"
                      className="flex-1 rounded-lg text-xs font-semibold data-[state=active]:bg-card data-[state=active]:shadow-sm py-2"
                    >
                      <Radio size={13} className="mr-1" />
                      Lives
                    </TabsTrigger>
                    <TabsTrigger
                      value="about"
                      className="flex-1 rounded-lg text-xs font-semibold data-[state=active]:bg-card data-[state=active]:shadow-sm py-2"
                    >
                      <Info size={13} className="mr-1" />
                      About
                    </TabsTrigger>
                  </TabsList>

                  {/* Listings Tab */}
                  <TabsContent value="listings" className="mt-4">
                    {userProducts.length > 0 ? (
                      <div className="grid grid-cols-2 gap-3">
                        {userProducts.map((product) => (
                          <ProductCard key={product.id} product={product} />
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center py-12 text-center">
                        <Package size={32} className="text-muted-foreground/40" />
                        <p className="text-sm text-muted-foreground mt-2">No listings yet</p>
                      </div>
                    )}
                  </TabsContent>

                  {/* Reviews Tab */}
                  <TabsContent value="reviews" className="mt-4">
                    <div className="space-y-3">
                      {mockReviews.map((review) => (
                        <motion.div
                          key={review.id}
                          whileHover={{ scale: 1.01 }}
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
                                  size={12}
                                  className={cn(
                                    i < review.rating
                                      ? 'text-amber-500 fill-amber-500'
                                      : 'text-muted-foreground/30'
                                  )}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-foreground/80">{review.text}</p>
                        </motion.div>
                      ))}
                    </div>
                  </TabsContent>

                  {/* Lives Tab */}
                  <TabsContent value="lives" className="mt-4">
                    {userLives.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {userLives.map((stream) => (
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

                  {/* About Tab */}
                  <TabsContent value="about" className="mt-4">
                    <Card className="border-0 shadow-sm p-5 space-y-4">
                      <div>
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                          Bio
                        </h4>
                        <p className="text-sm text-foreground">{user.bio}</p>
                      </div>
                      <Separator />
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                            Location
                          </h4>
                          <p className="text-sm text-foreground">{user.location}</p>
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                            Joined
                          </h4>
                          <p className="text-sm text-foreground">{user.joinedDate}</p>
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                            Total Sales
                          </h4>
                          <p className="text-sm text-foreground">{user.totalSales.toLocaleString()}</p>
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                            Rating
                          </h4>
                          <p className="text-sm text-foreground">{user.rating} / 5.0</p>
                        </div>
                      </div>
                    </Card>
                  </TabsContent>
                </Tabs>
              </motion.div>

              <div className="h-8" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
