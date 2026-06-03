'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Heart, Share2, ShoppingCart, Gavel,
  ChevronDown, ChevronUp, BadgeCheck, Star, Store,
  MessageCircle, Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigationStore, useCartStore } from '@/stores';
import { mockProducts } from '@/lib/mock-data';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import UserAvatar from '@/components/shared/UserAvatar';
import PriceDisplay from '@/components/shared/PriceDisplay';
import ProductCard from '@/components/shared/ProductCard';
import type { ProductCondition } from '@/types';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ProductDetailView — Product detail page
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

const conditionLabels: Record<ProductCondition, string> = {
  new: 'New',
  like_new: 'Like New',
  good: 'Good',
  fair: 'Fair',
};

const conditionStyles: Record<ProductCondition, string> = {
  new: 'bg-emerald-500/10 text-emerald-600',
  like_new: 'bg-blue-500/10 text-blue-600',
  good: 'bg-amber-500/10 text-amber-600',
  fair: 'bg-rose-500/10 text-rose-600',
};

export default function ProductDetailView() {
  const navigate = useNavigationStore((s) => s.navigate);
  const goBack = useNavigationStore((s) => s.goBack);
  const viewParams = useNavigationStore((s) => s.viewParams);
  const addItem = useCartStore((s) => s.addItem);

  const productId = viewParams.id || 'p1';
  const product = mockProducts.find((p) => p.id === productId) || mockProducts[0];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(product.isLiked);
  const [likesCount, setLikesCount] = useState(product.likesCount);

  // Similar products (same category, excluding current)
  const similarProducts = mockProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 6);

  // If not enough similar, add some random ones
  const fallbackSimilar = similarProducts.length < 4
    ? [
        ...similarProducts,
        ...mockProducts.filter(
          (p) => p.id !== product.id && !similarProducts.find((s) => s.id === p.id)
        ).slice(0, 4 - similarProducts.length),
      ]
    : similarProducts;

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount((c) => (isLiked ? c - 1 : c + 1));
  };

  const handleAddToCart = () => {
    addItem(product as unknown as import('@/types').Product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ type: 'tween', ease: [0.32, 0.72, 0, 1], duration: 0.22 }}
      className="min-h-screen pb-28"
    >
      {/* ─── Back Button (overlay) ─── */}
      <div className="sticky top-0 z-30 flex justify-between items-start pointer-events-none">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={goBack}
          className="pointer-events-auto m-3 flex items-center justify-center w-9 h-9 rounded-full glass shadow-sm"
          aria-label="Go back"
        >
          <ArrowLeft size={18} />
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleLike}
          className="pointer-events-auto m-3 flex items-center justify-center w-9 h-9 rounded-full glass shadow-sm"
          aria-label="Like"
        >
          <Heart
            size={18}
            className={cn(
              'transition-colors',
              isLiked ? 'fill-rose-500 text-rose-500' : 'text-foreground'
            )}
          />
        </motion.button>
      </div>

      {/* ─── Image Gallery ─── */}
      <motion.div
        initial={{ opacity: 0, scale: 1.02 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative aspect-square bg-muted overflow-hidden"
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImageIndex}
            src={product.images[currentImageIndex] || product.images[0]}
            alt={product.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>

        {/* Image Pagination Dots */}
        {product.images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
            {product.images.map((_, i) => (
              <motion.button
                key={i}
                onClick={() => setCurrentImageIndex(i)}
                className={cn(
                  'rounded-full transition-all',
                  i === currentImageIndex
                    ? 'w-6 h-2 bg-white'
                    : 'w-2 h-2 bg-white/50'
                )}
                aria-label={`Image ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* Condition Badge */}
        <div className="absolute top-3 left-3">
          <Badge className={cn('text-[10px] font-bold', conditionStyles[product.condition])}>
            {conditionLabels[product.condition]}
          </Badge>
        </div>

        {/* Auction Badge */}
        {product.isAuction && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2">
            <Badge className="bg-rose-500 text-white border-0 text-[10px] font-black uppercase shadow-lg shadow-rose-500/30">
              🔴 Live Auction
            </Badge>
          </div>
        )}
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="px-4 pt-4 max-w-lg mx-auto"
      >
        {/* ─── Product Info ─── */}
        <motion.div variants={item} className="space-y-3">
          <div className="flex items-start justify-between">
            <h1 className="text-lg font-bold text-foreground leading-tight flex-1 mr-2">
              {product.title}
            </h1>
            <div className="flex items-center gap-1 shrink-0">
              <Heart
                size={20}
                className={cn(
                  isLiked ? 'fill-rose-500 text-rose-500' : 'text-muted-foreground'
                )}
              />
              <span className="text-sm font-medium text-muted-foreground tabular-nums">
                {likesCount}
              </span>
            </div>
          </div>

          <PriceDisplay
            price={product.price}
            originalPrice={product.originalPrice}
            currency={product.currency}
            size="lg"
          />

          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="text-[10px] font-medium">
              {product.category}
            </Badge>
            {product.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-[10px] font-medium">
                #{tag}
              </Badge>
            ))}
          </div>
        </motion.div>

        {/* ─── Seller Card ─── */}
        <motion.div variants={item} className="mt-4">
          <Card className="border-0 shadow-sm p-4">
            <div className="flex items-center gap-3">
              <UserAvatar user={product.seller} size="lg" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-foreground truncate">
                    {product.seller.displayName}
                  </h3>
                  {product.seller.isVerified && (
                    <BadgeCheck size={14} className="text-emerald-500 shrink-0" />
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex items-center gap-0.5">
                    <Star size={11} className="text-amber-500 fill-amber-500" />
                    <span className="text-xs font-semibold text-foreground tabular-nums">
                      {product.seller.rating}
                    </span>
                  </div>
                  <Separator orientation="vertical" className="h-3" />
                  <span className="text-[11px] text-muted-foreground">
                    {(product.seller.rating >= 4.8 ? 'Top Seller' : 'Seller')}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 shrink-0">
                <motion.div whileTap={{ scale: 0.95 }}>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-xl text-xs font-semibold h-8"
                  >
                    Follow
                  </Button>
                </motion.div>
                <motion.div whileTap={{ scale: 0.95 }}>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="rounded-xl text-xs font-semibold h-8"
                    onClick={() => navigate('seller-profile', { id: product.seller.id })}
                  >
                    <Store size={14} className="mr-1" />
                    Shop
                  </Button>
                </motion.div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* ─── Description ─── */}
        <motion.div variants={item} className="mt-4">
          <Card className="border-0 shadow-sm p-4">
            <h3 className="text-sm font-bold text-foreground mb-2">Description</h3>
            <AnimatePresence>
              <motion.div
                className={cn(
                  'text-sm text-foreground/80 leading-relaxed',
                  !isDescriptionExpanded && 'line-clamp-3'
                )}
              >
                {product.description}
              </motion.div>
            </AnimatePresence>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              className="flex items-center gap-1 mt-2 text-xs font-semibold text-primary"
            >
              {isDescriptionExpanded ? (
                <>
                  Show less <ChevronUp size={14} />
                </>
              ) : (
                <>
                  Show more <ChevronDown size={14} />
                </>
              )}
            </motion.button>
          </Card>
        </motion.div>

        {/* ─── Similar Items ─── */}
        {fallbackSimilar.length > 0 && (
          <motion.div variants={item} className="mt-6">
            <h3 className="text-sm font-bold text-foreground mb-3">Similar Items</h3>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
              {fallbackSimilar.map((p) => (
                <div key={p.id} className="w-40 shrink-0">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <div className="h-4" />
      </motion.div>

      {/* ─── Bottom Action Bar (sticky) ─── */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24, delay: 0.2 }}
        className="fixed bottom-0 left-0 right-0 z-40 lg:hidden safe-bottom"
      >
        <div className="glass border-t border-border/30 px-4 py-3">
          <div className="flex items-center gap-2 max-w-lg mx-auto">
            <motion.div whileTap={{ scale: 0.95 }} className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="rounded-xl w-10 h-10"
                onClick={handleLike}
              >
                <Heart
                  size={18}
                  className={cn(
                    isLiked ? 'fill-rose-500 text-rose-500' : 'text-foreground'
                  )}
                />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-xl w-10 h-10"
              >
                <Share2 size={18} />
              </Button>
            </motion.div>

            {product.isAuction ? (
              <motion.div whileTap={{ scale: 0.98 }} className="flex-1">
                <Button
                  className="w-full rounded-xl h-11 font-bold text-sm shadow-lg shadow-rose-500/20 bg-rose-600 hover:bg-rose-700 text-white"
                  onClick={() => navigate('auction', { id: product.id })}
                >
                  <Gavel size={16} className="mr-1.5" />
                  Place Bid — ${product.currentBid?.toLocaleString()}
                </Button>
              </motion.div>
            ) : (
              <>
                <motion.div whileTap={{ scale: 0.95 }} className="flex-1">
                  <Button
                    variant="outline"
                    onClick={handleAddToCart}
                    className="w-full rounded-xl h-11 font-bold text-sm"
                  >
                    <ShoppingCart size={16} className="mr-1.5" />
                    Add to Cart
                  </Button>
                </motion.div>
                <motion.div whileTap={{ scale: 0.95 }} className="flex-1">
                  <Button
                    className="w-full rounded-xl h-11 font-bold text-sm shadow-lg shadow-primary/20"
                  >
                    Buy Now
                  </Button>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
