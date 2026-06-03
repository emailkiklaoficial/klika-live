'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Heart,
  Flame,
  Banknote,
  ShoppingCart,
  Share2,
  Star,
  Minimize2,
  Maximize2,
  X,
  Eye,
  Smile,
  Package,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useLiveStore, useCartStore, useNavigationStore } from '@/stores';
import { mockLiveStreams, mockMessages } from '@/lib/mock-data';
import type { ChatMessage, LiveProduct } from '@/types';
import LiveBadge from '@/components/shared/LiveBadge';
import ReactionFloating from '@/components/shared/ReactionFloating';
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

const slideInRight = {
  initial: { x: '100%', opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: '100%', opacity: 0 },
};

const scalePop = {
  initial: { scale: 0 },
  animate: { scale: 1 },
  exit: { scale: 0 },
};

const bidFlash = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 1.1, opacity: 0 },
};

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Helpers
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function formatTimeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const secs = Math.floor(diff / 1000);
  if (secs < 60) return 'now';
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h`;
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Product Spotlight Card (slides in from right over video)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

interface ProductSpotlightProps {
  product: LiveProduct;
  onClose: () => void;
  onBuy: () => void;
}

function ProductSpotlight({ product, onClose, onBuy }: ProductSpotlightProps) {
  return (
    <motion.div
      variants={slideInRight}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="absolute top-12 right-2 w-[160px] sm:w-[200px] z-20"
    >
      <div className="glass rounded-xl overflow-hidden shadow-xl border border-white/10">
        <button
          onClick={onClose}
          className="absolute top-1.5 right-1.5 z-10 flex items-center justify-center size-5 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
          aria-label="Close spotlight"
        >
          <X size={12} />
        </button>
        <div className="relative aspect-square bg-black/20">
          <img
            src={product.product.images[0]}
            alt={product.product.title}
            className="w-full h-full object-cover"
          />
          {product.discount && (
            <Badge className="absolute top-1.5 left-1.5 bg-rose-500 text-white text-[10px] px-1.5 py-0 border-0">
              -{product.discount}%
            </Badge>
          )}
        </div>
        <div className="p-2 space-y-1">
          <p className="text-[11px] font-semibold text-white leading-tight line-clamp-2">
            {product.product.title}
          </p>
          <PriceDisplay price={product.price} originalPrice={product.product.originalPrice} size="sm" />
          <Button
            size="sm"
            onClick={onBuy}
            className="w-full h-7 text-[11px] font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg mt-1"
          >
            Buy Now
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Product Carousel Item
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

interface ProductCarouselItemProps {
  product: LiveProduct;
  isSelected: boolean;
  onSelect: () => void;
}

function ProductCarouselItem({ product, isSelected, onSelect }: ProductCarouselItemProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onSelect}
      className={cn(
        'relative flex-shrink-0 w-[100px] sm:w-[130px] rounded-xl overflow-hidden border-2 transition-colors',
        isSelected ? 'border-primary shadow-lg shadow-primary/20' : 'border-transparent'
      )}
    >
      <div className="aspect-square bg-muted">
        <img
          src={product.product.images[0]}
          alt={product.product.title}
          className="w-full h-full object-cover"
        />
      </div>
      {product.discount && (
        <Badge className="absolute top-1 left-1 bg-rose-500 text-white text-[9px] px-1 py-px border-0">
          -{product.discount}%
        </Badge>
      )}
      <div className="p-1.5 bg-card">
        <p className="text-[10px] font-medium text-foreground truncate">{product.product.title}</p>
        <PriceDisplay price={product.price} size="sm" />
      </div>
    </motion.button>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Chat Message Bubble
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

interface ChatMessageBubbleProps {
  message: ChatMessage;
}

function ChatMessageBubble({ message }: ChatMessageBubbleProps) {
  const isSeller = message.role === 'seller';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        'flex items-start gap-2 px-3 py-1.5 rounded-lg',
        isSeller ? 'bg-primary/8 border border-primary/10' : ''
      )}
    >
      <div className="flex-shrink-0 mt-0.5">
        <UserAvatar user={message.user} size="sm" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              'text-[11px] font-semibold truncate',
              isSeller ? 'text-primary' : 'text-foreground'
            )}
          >
            {message.user.displayName}
          </span>
          {isSeller && (
            <span className="flex-shrink-0 text-[9px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-1 py-px rounded">
              Host
            </span>
          )}
          <span className="text-[10px] text-muted-foreground">
            {formatTimeAgo(message.timestamp)}
          </span>
        </div>
        <p className="text-[12px] text-foreground/90 leading-snug mt-0.5 break-words">
          {message.content}
        </p>
      </div>
    </motion.div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   LiveView — Main Component
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export default function LiveView() {
  const stream = mockLiveStreams[0];

  /* ─── Stores ─── */
  const setStream = useLiveStore((s) => s.setStream);
  const messages = useLiveStore((s) => s.messages);
  const addMessage = useLiveStore((s) => s.addMessage);
  const viewerCount = useLiveStore((s) => s.viewerCount);
  const setViewerCount = useLiveStore((s) => s.setViewerCount);
  const addReaction = useLiveStore((s) => s.addReaction);
  const addItem = useCartStore((s) => s.addItem);

  /* ─── Local State ─── */
  const [chatInput, setChatInput] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<LiveProduct | null>(
    () => stream.products.find((p) => p.isFeatured) ?? stream.products[0] ?? null
  );
  const [showSpotlight, setShowSpotlight] = useState(false);
  const [isPiP, setIsPiP] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'products'>('chat');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  /* ─── Initialize store with stream data ─── */
  useEffect(() => {
    setStream(stream);
    // Pre-load messages
    mockMessages.forEach((msg) => addMessage(msg));
  }, []);

  /* ─── Simulate viewer count changes ─── */
  useEffect(() => {
    const interval = setInterval(() => {
      const delta = Math.floor(Math.random() * 11) - 5; // -5 to +5
      setViewerCount(Math.max(100, viewerCount + delta));
    }, 3000);
    return () => clearInterval(interval);
  }, [viewerCount, setViewerCount]);

  /* ─── Auto-scroll chat to bottom ─── */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /* ─── Auto-show spotlight for featured product ─── */
  useEffect(() => {
    const timer = setTimeout(() => setShowSpotlight(true), 800);
    return () => clearTimeout(timer);
  }, []);

  /* ─── Send Chat Message ─── */
  const handleSendChat = useCallback(() => {
    if (!chatInput.trim()) return;
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      userId: 'current-user',
      user: {
        id: 'current-user',
        username: 'you',
        displayName: 'You',
        avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=you',
      },
      content: chatInput.trim(),
      role: 'user',
      timestamp: new Date().toISOString(),
    };
    addMessage(newMsg);
    setChatInput('');
  }, [chatInput, addMessage]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendChat();
      }
    },
    [handleSendChat]
  );

  /* ─── Reaction Handler ─── */
  const handleReaction = useCallback(
    (emoji: string) => {
      addReaction(emoji);
    },
    [addReaction]
  );

  /* ─── Buy Handler ─── */
  const handleBuy = useCallback(() => {
    if (selectedProduct) {
      addItem(selectedProduct.product);
    }
  }, [selectedProduct, addItem]);

  /* ─── No stream fallback ─── */
  if (!stream) return null;

  const currentProduct = selectedProduct || stream.products[0];

  return (
    <div className="relative min-h-[calc(100vh-5.5rem)] bg-background">
      {/* ═══════════════════════════════════════════════════════════════════════
         VIDEO AREA (top 60% on mobile)
         ═══════════════════════════════════════════════════════════════════════ */}
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        className={cn(
          'relative w-full bg-black overflow-hidden',
          isPiP
            ? 'fixed bottom-20 right-2 z-50 w-40 h-56 sm:w-48 sm:h-64 rounded-xl shadow-2xl ring-2 ring-white/10'
            : 'h-[55vh] sm:h-[60vh]'
        )}
      >
        {/* Gradient background simulating video */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-slate-800 to-gray-950" />
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: `url(${stream.thumbnail})` }}
        />

        {/* Subtle animated gradient overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"
          animate={{ opacity: [0.8, 0.9, 0.8] }}
          transition={{ repeat: Infinity, duration: 4 }}
        />

        {/* ─── Top overlays ─── */}
        <div className="absolute top-0 left-0 right-0 p-3 flex items-start justify-between z-10">
          {/* Live Badge */}
          <LiveBadge viewerCount={viewerCount} size="md" />

          {/* PiP Toggle */}
          {!isPiP && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsPiP(true)}
              className="flex items-center gap-1.5 rounded-full glass px-2.5 py-1.5 text-white text-[11px] font-medium"
              aria-label="Picture in Picture"
            >
              <Minimize2 size={12} />
              <span className="hidden sm:inline">PiP</span>
            </motion.button>
          )}
          {isPiP && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsPiP(false)}
              className="absolute top-1 right-1 flex items-center justify-center size-6 rounded-full bg-black/60 text-white z-30"
              aria-label="Expand video"
            >
              <Maximize2 size={12} />
            </motion.button>
          )}
        </div>

        {/* ─── Floating Reactions ─── */}
        <ReactionFloating />

        {/* ─── Product Spotlight (slides from right) ─── */}
        <AnimatePresence>
          {showSpotlight && currentProduct && !isPiP && (
            <ProductSpotlight
              product={currentProduct}
              onClose={() => setShowSpotlight(false)}
              onBuy={handleBuy}
            />
          )}
        </AnimatePresence>

        {/* ─── Bottom seller info overlay (video area) ─── */}
        {!isPiP && (
          <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2.5"
            >
              <UserAvatar user={stream.seller} size="md" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-semibold text-white truncate">
                    {stream.seller.displayName}
                  </p>
                  {stream.seller.isVerified && (
                    <Star className="size-3 text-amber-400 fill-amber-400" />
                  )}
                </div>
                <p className="text-[11px] text-white/70 truncate">{stream.title}</p>
              </div>
              <Button
                size="sm"
                className="h-8 px-4 text-[11px] font-bold rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Follow
              </Button>
            </motion.div>
          </div>
        )}
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════════════
         INTERACTIVE AREA (bottom 40%)
         ═══════════════════════════════════════════════════════════════════════ */}
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.15 }}
        className="relative flex flex-col bg-background rounded-t-2xl -mt-4 z-10"
      >
        {/* ─── Tab Switcher ─── */}
        <div className="flex items-center border-b border-border">
          <button
            onClick={() => setActiveTab('chat')}
            className={cn(
              'flex-1 py-3 text-sm font-semibold text-center transition-colors relative',
              activeTab === 'chat' ? 'text-foreground' : 'text-muted-foreground'
            )}
          >
            Live Chat
            {activeTab === 'chat' && (
              <motion.div
                layoutId="live-tab-indicator"
                className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary rounded-full"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={cn(
              'flex-1 py-3 text-sm font-semibold text-center transition-colors relative',
              activeTab === 'products' ? 'text-foreground' : 'text-muted-foreground'
            )}
          >
            <span className="flex items-center justify-center gap-1.5">
              <Package size={14} />
              Products ({stream.products.length})
            </span>
            {activeTab === 'products' && (
              <motion.div
                layoutId="live-tab-indicator"
                className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary rounded-full"
              />
            )}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {/* ═════════════════════════════════════════════════════════════════════
             CHAT TAB
             ═══════════════════════════════════════════════════════════════════════ */}
          {activeTab === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col"
            >
              {/* Chat Messages */}
              <div className="flex-1 max-h-[200px] sm:max-h-[280px] overflow-y-auto py-2 space-y-1 px-1">
                <AnimatePresence initial={false}>
                  {messages.map((msg) => (
                    <ChatMessageBubble key={msg.id} message={msg} />
                  ))}
                </AnimatePresence>
                <div ref={chatEndRef} />
              </div>

              <Separator />

              {/* ─── Reaction Buttons ─── */}
              <div className="flex items-center gap-2 px-3 py-2">
                {[
                  { emoji: '❤️', label: 'Heart', icon: Heart },
                  { emoji: '🔥', label: 'Fire', icon: Flame },
                  { emoji: '💰', label: 'Money', icon: Banknote },
                ].map((r) => (
                  <motion.button
                    key={r.emoji}
                    whileTap={{ scale: 1.3 }}
                    whileHover={{ scale: 1.1 }}
                    onClick={() => handleReaction(r.emoji)}
                    className="flex items-center justify-center size-10 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                    aria-label={r.label}
                  >
                    <span className="text-lg">{r.emoji}</span>
                  </motion.button>
                ))}

                <div className="flex-1" />

                <div className="flex items-center gap-1">
                  <AnimatePresence>
                    <motion.div
                      variants={scalePop}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="flex items-center gap-0.5 text-muted-foreground"
                    >
                      <Eye size={12} />
                      <span className="text-[11px] font-semibold tabular-nums">
                        {viewerCount.toLocaleString()}
                      </span>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* ─── Chat Input Bar ─── */}
              <div className="flex items-center gap-2 px-3 pb-3 pt-1">
                <button
                  className="flex-shrink-0 flex items-center justify-center size-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  aria-label="Emoji picker"
                >
                  <Smile size={18} />
                </button>
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Say something..."
                    className="w-full h-8 rounded-full bg-muted px-3.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 transition-shadow"
                    maxLength={200}
                  />
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleSendChat}
                  disabled={!chatInput.trim()}
                  className={cn(
                    'flex-shrink-0 flex items-center justify-center size-8 rounded-full transition-colors',
                    chatInput.trim()
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  )}
                  aria-label="Send message"
                >
                  <Send size={14} />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ═════════════════════════════════════════════════════════════════════
             PRODUCTS TAB
             ═══════════════════════════════════════════════════════════════════════ */}
          {activeTab === 'products' && (
            <motion.div
              key="products"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-3 space-y-3"
            >
              {/* ─── Product Carousel ─── */}
              <div
                ref={carouselRef}
                className="flex gap-2.5 overflow-x-auto no-scrollbar pb-2 -mx-1 px-1 snap-x snap-mandatory"
              >
                {stream.products.map((lp) => (
                  <ProductCarouselItem
                    key={lp.id}
                    product={lp}
                    isSelected={selectedProduct?.id === lp.id}
                    onSelect={() => {
                      setSelectedProduct(lp);
                      setShowSpotlight(true);
                    }}
                  />
                ))}
              </div>

              <Separator />

              {/* ─── Selected Product Detail ─── */}
              {currentProduct && (
                <motion.div
                  key={currentProduct.id}
                  variants={fadeInUp}
                  initial="initial"
                  animate="animate"
                  className="space-y-3"
                >
                  <div className="flex gap-3">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={currentProduct.product.images[0]}
                        alt={currentProduct.product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <h3 className="text-sm font-bold text-foreground leading-tight line-clamp-2">
                        {currentProduct.product.title}
                      </h3>
                      <div className="flex items-center gap-1.5">
                        <UserAvatar user={currentProduct.product.seller} size="sm" />
                        <span className="text-[11px] text-muted-foreground">
                          {currentProduct.product.seller.displayName}
                        </span>
                      </div>
                      <PriceDisplay
                        price={currentProduct.price}
                        originalPrice={currentProduct.product.originalPrice}
                        size="md"
                      />
                    </div>
                  </div>

                  <p className="text-[12px] text-muted-foreground leading-relaxed line-clamp-3">
                    {currentProduct.product.description}
                  </p>

                  {/* ─── Buy Now Button ─── */}
                  <Button
                    size="lg"
                    onClick={handleBuy}
                    className="w-full h-12 text-sm font-bold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25"
                  >
                    Buy Now — ${currentProduct.price.toLocaleString()}
                  </Button>

                  {/* ─── Quick Actions Row ─── */}
                  <div className="flex items-center justify-center gap-4 py-1">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      aria-label="Share"
                    >
                      <Share2 size={16} />
                      <span className="text-[11px] font-medium">Share</span>
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={handleBuy}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      aria-label="Add to cart"
                    >
                      <ShoppingCart size={16} />
                      <span className="text-[11px] font-medium">Add to Cart</span>
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-50 transition-colors"
                      aria-label="Favorite"
                    >
                      <Heart size={16} />
                      <span className="text-[11px] font-medium">Save</span>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
