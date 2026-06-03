'use client';

import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import {
  ShoppingCart, Trash2, Minus, Plus, ShoppingBag,
  ArrowLeft, Tag, Shield, ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigationStore, useCartStore } from '@/stores';
import { mockProducts } from '@/lib/mock-data';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import UserAvatar from '@/components/shared/UserAvatar';
import PriceDisplay from '@/components/shared/PriceDisplay';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CartView — Shopping cart view
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

export default function CartView() {
  const navigate = useNavigationStore((s) => s.navigate);
  const goBack = useNavigationStore((s) => s.goBack);
  const cartItems = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const cartTotal = useCartStore((s) => s.total);

  // Add a default mock item if cart is empty for demo purposes
  const items = cartItems.length > 0 ? cartItems : (() => {
    // Lazy init a demo item (won't persist since it's read-only here)
    return [];
  })();

  const isEmpty = items.length === 0;

  const subtotal = cartTotal();
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleAddDefaultItem = () => {
    addItem(mockProducts[0]); // MacBook Pro
  };

  const handleRemoveWithAnimation = (productId: string) => {
    removeItem(productId);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: 'tween', ease: [0.32, 0.72, 0, 1], duration: 0.22 }}
      className="min-h-screen"
    >
      {/* ─── Header ─── */}
      <header className="sticky top-0 z-30 glass border-b border-border/30">
        <div className="flex items-center gap-3 px-4 py-3">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={goBack}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-secondary/80 hover:bg-secondary transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={18} />
          </motion.button>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-foreground">My Cart</h1>
            {!isEmpty && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold"
              >
                {items.reduce((sum, i) => sum + i.quantity, 0)}
              </motion.span>
            )}
          </div>
        </div>
      </header>

      <div className="px-4 py-5 max-w-lg mx-auto">
        <AnimatePresence mode="wait">
          {/* ═══════════════════════════════════════════════════════════════════
              Empty State
              ═══════════════════════════════════════════════════════════════════ */}
          {isEmpty && (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center min-h-[50vh] gap-5"
            >
              <motion.div
                className="flex items-center justify-center w-20 h-20 rounded-2xl bg-muted"
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              >
                <ShoppingBag size={32} className="text-muted-foreground" />
              </motion.div>

              <div className="text-center">
                <h2 className="text-lg font-bold text-foreground">Your cart is empty</h2>
                <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                  Discover amazing products from sellers around the world
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => navigate('marketplace')}
                  className="rounded-xl font-semibold px-6"
                >
                  <ShoppingBag size={16} className="mr-2" />
                  Start Shopping
                </Button>
                <Button
                  variant="outline"
                  onClick={handleAddDefaultItem}
                  className="rounded-xl font-semibold px-6"
                >
                  <ShoppingCart size={16} className="mr-2" />
                  Add Demo Item
                </Button>
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              Cart Items List
              ═══════════════════════════════════════════════════════════════════ */}
          {!isEmpty && (
            <motion.div
              key="cart-items"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-5"
            >
              {/* Cart Items */}
              <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
                <AnimatePresence>
                  {items.map((cartItem) => (
                    <motion.div
                      key={cartItem.id}
                      variants={item}
                      exit={{ opacity: 0, x: -100, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="border-0 shadow-sm overflow-hidden">
                        <div className="flex gap-3 p-3">
                          {/* Product Image */}
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="w-24 h-24 rounded-xl overflow-hidden bg-muted shrink-0 cursor-pointer"
                            onClick={() => navigate('product-detail', { id: cartItem.product.id })}
                          >
                            <img
                              src={cartItem.product.images[0]}
                              alt={cartItem.product.title}
                              className="w-full h-full object-cover"
                            />
                          </motion.div>

                          {/* Product Info */}
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <h3
                                className="text-sm font-semibold text-foreground line-clamp-2 cursor-pointer hover:text-primary transition-colors"
                                onClick={() => navigate('product-detail', { id: cartItem.product.id })}
                              >
                                {cartItem.product.title}
                              </h3>
                              <div className="flex items-center gap-1.5 mt-1">
                                <UserAvatar
                                  user={cartItem.product.seller}
                                  size="sm"
                                />
                                <span className="text-[11px] text-muted-foreground truncate">
                                  {cartItem.product.seller.displayName}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between mt-2">
                              {/* Price */}
                              <PriceDisplay
                                price={cartItem.product.price * cartItem.quantity}
                                currency={cartItem.product.currency}
                                size="sm"
                                showBadge={false}
                              />

                              {/* Quantity Controls */}
                              <div className="flex items-center gap-2">
                                <motion.button
                                  whileTap={{ scale: 0.85 }}
                                  onClick={() =>
                                    cartItem.quantity > 1
                                      ? updateQuantity(cartItem.product.id, cartItem.quantity - 1)
                                      : removeItem(cartItem.product.id)
                                  }
                                  className="flex items-center justify-center w-7 h-7 rounded-lg border border-border hover:bg-muted transition-colors"
                                >
                                  <Minus size={12} />
                                </motion.button>
                                <span className="w-6 text-center text-sm font-bold tabular-nums">
                                  {cartItem.quantity}
                                </span>
                                <motion.button
                                  whileTap={{ scale: 0.85 }}
                                  onClick={() => updateQuantity(cartItem.product.id, cartItem.quantity + 1)}
                                  className="flex items-center justify-center w-7 h-7 rounded-lg border border-border hover:bg-muted transition-colors"
                                >
                                  <Plus size={12} />
                                </motion.button>
                              </div>
                            </div>
                          </div>

                          {/* Remove Button */}
                          <motion.button
                            whileTap={{ scale: 0.85 }}
                            onClick={() => handleRemoveWithAnimation(cartItem.product.id)}
                            className="self-start p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors shrink-0"
                            aria-label="Remove item"
                          >
                            <Trash2 size={16} className="text-muted-foreground hover:text-rose-500" />
                          </motion.button>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* ─── Promo Code ─── */}
              <Card className="border-0 shadow-sm p-3">
                <div className="flex items-center gap-2">
                  <Tag size={16} className="text-muted-foreground shrink-0" />
                  <input
                    type="text"
                    placeholder="Enter promo code"
                    className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
                  />
                  <Button size="sm" variant="outline" className="rounded-lg text-xs font-semibold shrink-0">
                    Apply
                  </Button>
                </div>
              </Card>

              {/* ─── Order Summary ─── */}
              <Card className="border-0 shadow-sm p-5">
                <h3 className="text-sm font-bold text-foreground mb-4">Order Summary</h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Subtotal</span>
                    <span className="text-sm font-medium text-foreground tabular-nums">
                      ${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Shipping</span>
                    <span className="text-sm font-medium text-foreground tabular-nums">
                      {shipping === 0 ? (
                        <span className="text-emerald-600">Free</span>
                      ) : (
                        `$${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Tax</span>
                    <span className="text-sm font-medium text-foreground tabular-nums">
                      ${tax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="h-px w-full bg-border/60 my-1" />

                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-foreground">Total</span>
                    <span className="font-mono text-xl font-bold text-primary tabular-nums">
                      ${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </Card>

              {/* ─── Security Badge ─── */}
              <div className="flex items-center justify-center gap-2 py-1">
                <Shield size={14} className="text-emerald-600" />
                <span className="text-[11px] text-muted-foreground">
                  Secure checkout — encrypted by KLIKA
                </span>
              </div>

              {/* ─── Checkout Button ─── */}
              <motion.div whileTap={{ scale: 0.98 }}>
                <Button
                  size="lg"
                  className="w-full rounded-xl text-base font-bold h-14 shadow-lg shadow-primary/20"
                >
                  Proceed to Checkout
                  <ChevronRight size={18} className="ml-1" />
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
