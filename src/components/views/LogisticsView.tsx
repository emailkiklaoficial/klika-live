'use client';

import { motion } from 'framer-motion';
import {
  ArrowLeft, Package, Truck, MapPin, Clock, Check,
  Circle, QrCode, Phone, RotateCcw, Copy, ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigationStore } from '@/stores';
import { mockOrders, mockShippingSteps } from '@/lib/mock-data';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LogisticsView — Shipping & tracking view
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

function formatTimestamp(ts?: string): string {
  if (!ts) return '';
  const date = new Date(ts);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export default function LogisticsView() {
  const goBack = useNavigationStore((s) => s.goBack);
  const order = mockOrders[0]; // Shipped order for demo
  const steps = mockShippingSteps;

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
          <div>
            <h1 className="text-lg font-bold text-foreground">Order Tracking</h1>
            <p className="text-[11px] text-muted-foreground">Order #{order.id.toUpperCase()}</p>
          </div>
        </div>
      </header>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="px-4 py-5 max-w-lg mx-auto space-y-5"
      >
        {/* ═══════════════════════════════════════════════════════════════════
            Order Summary Card
            ═══════════════════════════════════════════════════════════════════ */}
        <motion.div variants={item}>
          <Card className="border-0 shadow-sm overflow-hidden">
            <div className="flex gap-4 p-4">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted shrink-0">
                <img
                  src={order.product.images[0]}
                  alt={order.product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-foreground line-clamp-2">
                  {order.product.title}
                </h3>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Sold by {order.seller.displayName}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-mono text-base font-bold text-foreground tabular-nums">
                    ${order.totalPrice.toLocaleString()}
                  </span>
                  <Badge
                    className={cn(
                      'text-[10px] font-bold uppercase',
                      order.status === 'shipped' && 'bg-blue-500/10 text-blue-600 border-0'
                    )}
                  >
                    <Truck size={10} className="mr-1" />
                    {order.status}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════════
            Tracking Timeline
            ═══════════════════════════════════════════════════════════════════ */}
        <motion.div variants={item}>
          <Card className="border-0 shadow-sm p-5">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-5">
              <MapPin size={14} className="text-primary" />
              Shipment Progress
            </h3>

            <div className="relative">
              {steps.map((step, index) => {
                const isLast = index === steps.length - 1;
                const isCompleted = step.status === 'completed';
                const isActive = step.status === 'active';

                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.12 }}
                    className="relative flex gap-4 pb-6 last:pb-0"
                  >
                    {/* Line + Circle Indicator */}
                    <div className="flex flex-col items-center">
                      {/* Circle */}
                      <motion.div
                        className={cn(
                          'flex items-center justify-center w-8 h-8 rounded-full shrink-0 z-10',
                          isCompleted && 'bg-emerald-500',
                          isActive && 'bg-primary',
                          step.status === 'pending' && 'bg-muted-foreground/20'
                        )}
                        animate={isActive ? { scale: [1, 1.15, 1] } : {}}
                        transition={isActive ? { repeat: Infinity, duration: 2, ease: 'easeInOut' } : {}}
                      >
                        {isCompleted ? (
                          <Check size={14} className="text-white" strokeWidth={3} />
                        ) : isActive ? (
                          <Truck size={14} className="text-white" />
                        ) : (
                          <Circle size={8} className="text-muted-foreground/40" />
                        )}
                      </motion.div>

                      {/* Connecting Line */}
                      {!isLast && (
                        <div
                          className={cn(
                            'w-0.5 flex-1 mt-1',
                            isCompleted ? 'bg-emerald-500/40' : 'bg-border'
                          )}
                        />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-2">
                      <p
                        className={cn(
                          'text-sm font-semibold',
                          isCompleted && 'text-emerald-700 dark:text-emerald-400',
                          isActive && 'text-primary',
                          step.status === 'pending' && 'text-muted-foreground'
                        )}
                      >
                        {step.label}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {step.description}
                      </p>
                      {step.timestamp && (
                        <p className="flex items-center gap-1 text-[11px] text-muted-foreground/70 mt-1">
                          <Clock size={10} />
                          {formatTimestamp(step.timestamp)}
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </Card>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════════
            Shipping Info
            ═══════════════════════════════════════════════════════════════════ */}
        <motion.div variants={item}>
          <Card className="border-0 shadow-sm p-5">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-4">
              <Truck size={14} className="text-muted-foreground" />
              Shipping Details
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Carrier</span>
                <span className="text-sm font-medium text-foreground">KLIKA Express</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Tracking Number</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-medium text-foreground tabular-nums">
                    KL20241204001
                  </span>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="p-1 rounded-md hover:bg-muted transition-colors"
                    aria-label="Copy tracking number"
                  >
                    <Copy size={14} className="text-muted-foreground" />
                  </motion.button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Estimated Delivery</span>
                <span className="text-sm font-medium text-foreground">Dec 8, 2024</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Shipping Method</span>
                <Badge variant="secondary" className="text-[10px] font-medium">
                  Priority (2-3 days)
                </Badge>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════════
            QR Code Area
            ═══════════════════════════════════════════════════════════════════ */}
        <motion.div variants={item}>
          <Card className="border-0 shadow-sm p-5">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-4">
              <QrCode size={14} className="text-muted-foreground" />
              Shipping Label
            </h3>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex flex-col items-center gap-3 p-6 rounded-xl bg-muted/50 border border-dashed border-border/60"
            >
              <motion.div
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="flex items-center justify-center w-32 h-32 rounded-xl bg-card border border-border shadow-sm"
              >
                <QrCode size={48} className="text-muted-foreground/40" />
              </motion.div>
              <p className="text-xs text-muted-foreground text-center">
                Scan QR code to track shipment or show at pickup
              </p>
            </motion.div>
          </Card>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════════
            Action Buttons
            ═══════════════════════════════════════════════════════════════════ */}
        <motion.div variants={item} className="flex gap-3">
          <motion.div whileTap={{ scale: 0.97 }} className="flex-1">
            <Button
              variant="outline"
              className="w-full rounded-xl h-12 font-semibold"
            >
              <Phone size={16} className="mr-2" />
              Contact Seller
            </Button>
          </motion.div>
          <motion.div whileTap={{ scale: 0.97 }} className="flex-1">
            <Button
              variant="outline"
              className="w-full rounded-xl h-12 font-semibold"
            >
              <RotateCcw size={16} className="mr-2" />
              Request Return
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
