'use client';

import { motion } from 'framer-motion';
import {
  BarChart3, Eye, Clock, DollarSign, TrendingUp,
  ShoppingBag, Users, Brain, Package, ArrowLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigationStore } from '@/stores';
import { mockAnalytics } from '@/lib/mock-data';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer,
} from 'recharts';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// AnalyticsView — Live stream analytics
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export default function AnalyticsView() {
  const goBack = useNavigationStore((s) => s.goBack);
  const data = mockAnalytics;

  const metrics = [
    { label: 'Peak Viewers', value: data.peakViewers.toLocaleString(), icon: Eye, color: 'text-primary' },
    { label: 'Avg Viewers', value: data.averageViewers.toLocaleString(), icon: Users, color: 'text-violet-600' },
    { label: 'Duration', value: formatDuration(data.totalDuration), icon: Clock, color: 'text-amber-600' },
    { label: 'Revenue', value: `$${data.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-600' },
    { label: 'Conversion', value: `${data.conversionRate}%`, icon: TrendingUp, color: 'text-primary' },
    { label: 'Products Sold', value: data.productsSold.toString(), icon: Package, color: 'text-amber-600' },
  ];

  const maxRevenue = Math.max(...data.topProducts.map((p) => p.revenue));

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
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-bold text-foreground">Live Analytics</h1>
            <p className="text-[11px] text-muted-foreground truncate">{data.title}</p>
          </div>
          <Badge className="bg-emerald-500/15 text-emerald-600 border-0 text-[10px] font-bold shrink-0">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse-live" />
            Completed
          </Badge>
        </div>
      </header>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="px-4 py-5 max-w-2xl mx-auto space-y-5"
      >
        {/* ═══════════════════════════════════════════════════════════════════
            Key Metrics Grid
            ═══════════════════════════════════════════════════════════════════ */}
        <motion.div variants={item} className="grid grid-cols-3 gap-2.5">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.label}
                whileHover={{ scale: 1.03 }}
                className="rounded-xl border border-border/50 bg-card p-3 text-center"
              >
                <Icon size={16} className={cn('mx-auto mb-1.5', metric.color)} />
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider leading-tight">
                  {metric.label}
                </p>
                <p className="text-lg font-bold text-foreground tabular-nums mt-0.5">
                  {metric.value}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════════
            Viewer Graph
            ═══════════════════════════════════════════════════════════════════ */}
        <motion.div variants={item}>
          <Card className="border-0 shadow-sm p-5">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-4">
              <Eye size={14} className="text-primary" />
              Viewer Count Over Time
            </h3>
            <div className="h-48 sm:h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.viewerGraph}>
                  <defs>
                    <linearGradient id="viewerGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.6 0.2 20 / 0.3)" />
                      <stop offset="100%" stopColor="oklch(0.6 0.2 20 / 0.02)" />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="time"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: 'oklch(0.5 0.02 20)' }}
                    dy={8}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: 'oklch(0.5 0.02 20)' }}
                    dx={-8}
                    tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'oklch(1 0 0)',
                      border: '1px solid oklch(0.91 0.01 20)',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      fontSize: '12px',
                    }}
                    labelStyle={{ color: 'oklch(0.15 0.02 20)', fontWeight: 600 }}
                    formatter={(value: number) => [value.toLocaleString(), 'Viewers']}
                  />
                  <Area
                    type="monotone"
                    dataKey="viewers"
                    stroke="oklch(0.6 0.2 20)"
                    strokeWidth={2.5}
                    fill="url(#viewerGradient)"
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 2, fill: 'white', stroke: 'oklch(0.6 0.2 20)' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════════
            Revenue Graph
            ═══════════════════════════════════════════════════════════════════ */}
        <motion.div variants={item}>
          <Card className="border-0 shadow-sm p-5">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-4">
              <DollarSign size={14} className="text-emerald-600" />
              Revenue Over Time
            </h3>
            <div className="h-48 sm:h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.revenueGraph}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.7 0.18 155 / 0.3)" />
                      <stop offset="100%" stopColor="oklch(0.7 0.18 155 / 0.02)" />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="time"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: 'oklch(0.5 0.02 20)' }}
                    dy={8}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: 'oklch(0.5 0.02 20)' }}
                    dx={-8}
                    tickFormatter={(v: number) => v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'oklch(1 0 0)',
                      border: '1px solid oklch(0.91 0.01 20)',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      fontSize: '12px',
                    }}
                    labelStyle={{ color: 'oklch(0.15 0.02 20)', fontWeight: 600 }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="oklch(0.7 0.18 155)"
                    strokeWidth={2.5}
                    fill="url(#revenueGradient)"
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 2, fill: 'white', stroke: 'oklch(0.7 0.18 155)' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════════
            Top Products
            ═══════════════════════════════════════════════════════════════════ */}
        <motion.div variants={item}>
          <Card className="border-0 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-border/50">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Package size={14} className="text-muted-foreground" />
                Top Products
              </h3>
            </div>
            <div className="divide-y divide-border/50">
              {data.topProducts.map((product, index) => {
                const barWidth = (product.revenue / maxRevenue) * 100;
                return (
                  <motion.div
                    key={product.product}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="px-5 py-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-[11px] font-bold">
                          #{index + 1}
                        </span>
                        <span className="text-sm font-semibold text-foreground">
                          {product.product}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-right">
                        <div>
                          <span className="text-sm font-bold text-foreground tabular-nums">
                            ${product.revenue.toLocaleString()}
                          </span>
                          <p className="text-[10px] text-muted-foreground">
                            {product.sold} sold
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* Bar visualization */}
                    <div className="ml-9 h-2 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${barWidth}%` }}
                        transition={{ type: 'spring', stiffness: 300, damping: 24, delay: index * 0.1 + 0.2 }}
                        className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70"
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </Card>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════════
            AI Recommendations
            ═══════════════════════════════════════════════════════════════════ */}
        <motion.div variants={item}>
          <Card className="border-0 shadow-sm overflow-hidden">
            <div className="relative bg-gradient-to-br from-primary/8 via-violet-500/5 to-primary/3 p-5">
              <div className="absolute top-0 right-0 w-28 h-28 rounded-full bg-primary/8 blur-3xl" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-violet-600">
                    <Brain size={16} className="text-white" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground">AI Recommendation</h3>
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  Your electronics products had a 340% higher engagement during live streams
                  compared to static listings. The MacBook Pro had the highest conversion at
                  12.3%. Consider featuring it in your next live event with a flash deal
                  to maximize revenue.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 rounded-xl border-primary/20 text-primary hover:bg-primary/10"
                >
                  <Brain size={14} className="mr-1.5" />
                  Get full report
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
