'use client';

import { motion } from 'framer-motion';
import {
  Settings, Brain, TrendingUp, Package, Star, Users,
  Radio, PlusCircle, BarChart3, ArrowUpRight, ArrowDownRight,
  AlertCircle, CheckCircle2, Info, Zap, ShoppingBag,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigationStore } from '@/stores';
import { mockSellerInsights, mockOrders, mockLiveStreams } from '@/lib/mock-data';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SellerStudioView — AI-powered seller dashboard
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

/* Sparkline-like mini chart (pure SVG) */
function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 60;
  const h = 24;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="shrink-0">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function SellerStudioView() {
  const navigate = useNavigationStore((s) => s.navigate);

  const insights = mockSellerInsights;
  const recentOrders = mockOrders.slice(0, 5);

  const stats = [
    {
      label: 'Revenue',
      value: `$${(insights.totalRevenue / 1000).toFixed(1)}k`,
      change: insights.revenueChange,
      icon: TrendingUp,
      gradient: 'from-emerald-500/10 to-emerald-500/5',
      iconBg: 'bg-emerald-500/15',
      iconColor: 'text-emerald-600',
      sparkData: [12, 18, 15, 22, 19, 28, 32, 30, 35, 38, 42, 45],
      sparkColor: '#10b981',
    },
    {
      label: 'Orders',
      value: insights.totalOrders.toLocaleString(),
      change: insights.ordersChange,
      icon: Package,
      gradient: 'from-primary/10 to-primary/5',
      iconBg: 'bg-primary/15',
      iconColor: 'text-primary',
      sparkData: [20, 25, 22, 30, 28, 35, 40, 38, 45, 42, 50, 48],
      sparkColor: 'oklch(0.6 0.2 20)',
    },
    {
      label: 'Rating',
      value: insights.avgRating.toFixed(1),
      change: 0.2,
      icon: Star,
      gradient: 'from-amber-500/10 to-amber-500/5',
      iconBg: 'bg-amber-500/15',
      iconColor: 'text-amber-600',
      sparkData: [4.5, 4.6, 4.7, 4.6, 4.8, 4.7, 4.8, 4.9, 4.8, 4.9, 4.9, 4.9],
      sparkColor: '#f59e0b',
    },
    {
      label: 'Followers',
      value: `${(insights.followersCount / 1000).toFixed(1)}k`,
      change: insights.followersChange,
      icon: Users,
      gradient: 'from-violet-500/10 to-violet-500/5',
      iconBg: 'bg-violet-500/15',
      iconColor: 'text-violet-600',
      sparkData: [30, 32, 35, 34, 38, 40, 42, 41, 44, 43, 45, 45],
      sparkColor: '#8b5cf6',
    },
  ];

  const alertIcons = {
    info: <Info size={16} className="text-blue-500" />,
    warning: <AlertCircle size={16} className="text-amber-500" />,
    success: <CheckCircle2 size={16} className="text-emerald-500" />,
  };

  const alertStyles = {
    info: 'border-blue-500/20 bg-blue-500/5',
    warning: 'border-amber-500/20 bg-amber-500/5',
    success: 'border-emerald-500/20 bg-emerald-500/5',
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
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <motion.div
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10"
            >
              <TrendingUp size={20} className="text-primary" />
            </motion.div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Seller Studio</h1>
              <p className="text-[11px] text-muted-foreground">AI-powered dashboard</p>
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-secondary/80 hover:bg-secondary transition-colors"
            aria-label="Settings"
          >
            <Settings size={18} className="text-muted-foreground" />
          </motion.button>
        </div>
      </header>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="px-4 py-5 max-w-2xl mx-auto space-y-5"
      >
        {/* ═══════════════════════════════════════════════════════════════════
            Stats Cards Row
            ═══════════════════════════════════════════════════════════════════ */}
        <motion.div variants={item} className="grid grid-cols-2 gap-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            const isPositive = stat.change > 0;

            return (
              <motion.div
                key={stat.label}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'rounded-2xl border border-border/50 bg-gradient-to-br p-4',
                  stat.gradient
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className={cn('flex items-center justify-center w-8 h-8 rounded-lg', stat.iconBg)}>
                    <Icon size={16} className={stat.iconColor} />
                  </div>
                  <MiniSparkline data={stat.sparkData} color={stat.sparkColor} />
                </div>

                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </p>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-xl font-bold text-foreground tabular-nums">
                    {stat.value}
                  </span>
                  {stat.label === 'Rating' && (
                    <Star size={12} className="text-amber-500 fill-amber-500" />
                  )}
                </div>

                <div className="flex items-center gap-0.5 mt-1">
                  {isPositive ? (
                    <ArrowUpRight size={12} className="text-emerald-500" />
                  ) : (
                    <ArrowDownRight size={12} className="text-rose-500" />
                  )}
                  <span
                    className={cn(
                      'text-[11px] font-semibold tabular-nums',
                      isPositive ? 'text-emerald-500' : 'text-rose-500'
                    )}
                  >
                    +{stat.change}%
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════════
            AI Copilot Panel
            ═══════════════════════════════════════════════════════════════════ */}
        <motion.div variants={item}>
          <Card className="border-0 overflow-hidden shadow-lg">
            <div className="relative bg-gradient-to-br from-primary/10 via-violet-500/8 to-primary/5 p-5">
              {/* Decorative glow */}
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-primary/10 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-violet-500/10 blur-3xl" />

              <div className="relative">
                <div className="flex items-center gap-3 mb-3">
                  <motion.div
                    className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-violet-600 shadow-lg shadow-primary/20"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                  >
                    <Brain size={20} className="text-white" />
                  </motion.div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">AI Copilot</h3>
                    <p className="text-[11px] text-muted-foreground">Personalized insights for you</p>
                  </div>
                  <Badge className="ml-auto bg-primary/15 text-primary border-0 text-[10px] font-bold">
                    <Zap size={10} className="mr-0.5" />
                    AI
                  </Badge>
                </div>

                <p className="text-sm text-foreground/80 leading-relaxed">
                  {insights.aiRecommendation}
                </p>

                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 rounded-xl border-primary/20 text-primary hover:bg-primary/10"
                >
                  <Brain size={14} className="mr-1.5" />
                  Get more insights
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════════
            Alerts Section
            ═══════════════════════════════════════════════════════════════════ */}
        <motion.div variants={item} className="space-y-2">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <AlertCircle size={14} className="text-muted-foreground" />
            Alerts
          </h3>
          <div className="space-y-2">
            {insights.alerts.map((alert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  'flex items-start gap-3 rounded-xl border px-4 py-3',
                  alertStyles[alert.type]
                )}
              >
                <div className="mt-0.5 shrink-0">{alertIcons[alert.type]}</div>
                <p className="text-sm text-foreground">{alert.message}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════════
            Quick Actions
            ═══════════════════════════════════════════════════════════════════ */}
        <motion.div variants={item} className="grid grid-cols-3 gap-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('live')}
            className="flex flex-col items-center gap-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 transition-colors hover:bg-emerald-500/15"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/20">
              <Radio size={18} className="text-emerald-600" />
            </div>
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Go Live</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('create')}
            className="flex flex-col items-center gap-2 rounded-2xl bg-primary/10 border border-primary/20 p-4 transition-colors hover:bg-primary/15"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/20">
              <PlusCircle size={18} className="text-primary" />
            </div>
            <span className="text-xs font-semibold text-primary">Create Listing</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('analytics')}
            className="flex flex-col items-center gap-2 rounded-2xl bg-violet-500/10 border border-violet-500/20 p-4 transition-colors hover:bg-violet-500/15"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-violet-500/20">
              <BarChart3 size={18} className="text-violet-600" />
            </div>
            <span className="text-xs font-semibold text-violet-700 dark:text-violet-400">View Analytics</span>
          </motion.button>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════════
            Recent Sales
            ═══════════════════════════════════════════════════════════════════ */}
        <motion.div variants={item}>
          <Card className="border-0 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-border/50">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <ShoppingBag size={14} className="text-muted-foreground" />
                Recent Sales
              </h3>
            </div>
            <div className="divide-y divide-border/50">
              {recentOrders.map((order) => (
                <motion.div
                  key={order.id}
                  whileHover={{ backgroundColor: 'oklch(0.96 0.005 20)' }}
                  className="flex items-center gap-3 px-5 py-3"
                >
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted shrink-0">
                    <img
                      src={order.product.images[0]}
                      alt={order.product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {order.product.title}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {order.seller.displayName}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-foreground tabular-nums">
                      ${order.totalPrice.toLocaleString()}
                    </p>
                    <Badge
                      variant="secondary"
                      className={cn(
                        'text-[10px] font-medium',
                        order.status === 'shipped' && 'bg-blue-500/10 text-blue-600 border-0',
                        order.status === 'delivered' && 'bg-emerald-500/10 text-emerald-600 border-0',
                        order.status === 'pending' && 'bg-amber-500/10 text-amber-600 border-0'
                      )}
                    >
                      {order.status}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════════
            Audience Insights — Peak Hours
            ═══════════════════════════════════════════════════════════════════ */}
        <motion.div variants={item}>
          <Card className="border-0 shadow-sm p-5">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-4">
              <Users size={14} className="text-muted-foreground" />
              Audience Insights
            </h3>

            {/* Peak hours bar chart */}
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground mb-2">Peak Shopping Hours</p>
              <div className="flex items-end gap-1.5 h-20">
                {[
                  { hour: '6AM', val: 15 },
                  { hour: '9AM', val: 30 },
                  { hour: '12PM', val: 55 },
                  { hour: '3PM', val: 40 },
                  { hour: '6PM', val: 80 },
                  { hour: '9PM', val: 95 },
                  { hour: '12AM', val: 35 },
                ].map((bar) => (
                  <div key={bar.hour} className="flex flex-col items-center gap-1.5 flex-1">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${bar.val}%` }}
                      transition={{ type: 'spring', stiffness: 300, damping: 24, delay: 0.3 }}
                      className={cn(
                        'w-full rounded-t-md min-h-[4px]',
                        bar.val >= 80
                          ? 'bg-gradient-to-t from-primary to-primary/70'
                          : bar.val >= 50
                            ? 'bg-gradient-to-t from-primary/60 to-primary/40'
                            : 'bg-muted-foreground/20'
                      )}
                    />
                    <span className="text-[9px] text-muted-foreground">{bar.hour}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
