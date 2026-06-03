'use client';

import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LiveBadge — Animated LIVE indicator
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface LiveBadgeProps {
  viewerCount?: number;
  showViewers?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

const sizeClasses: Record<NonNullable<LiveBadgeProps['size']>, string> = {
  sm: 'px-2 py-0.5 text-[10px] gap-1',
  md: 'px-2.5 py-1 text-xs gap-1.5',
};

function formatViewers(count: number): string {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return count.toString();
}

export default function LiveBadge({
  viewerCount,
  showViewers = true,
  size = 'md',
  className,
}: LiveBadgeProps) {
  return (
    <motion.div
      className={cn(
        'inline-flex items-center rounded-full bg-rose-500 font-bold uppercase tracking-wider text-white shadow-lg shadow-rose-500/25',
        sizeClasses[size],
        className
      )}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
    >
      {/* Pulsing red dot */}
      <span className="relative flex size-2 shrink-0">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-white opacity-75" />
        <span className="relative inline-flex size-2 rounded-full bg-white" />
      </span>

      <span className="font-black leading-none">LIVE</span>

      {showViewers && viewerCount !== undefined && viewerCount > 0 && (
        <span className="flex items-center gap-0.5 opacity-90">
          <Eye size={size === 'sm' ? 10 : 12} />
          <span className="font-mono tabular-nums font-semibold">
            {formatViewers(viewerCount)}
          </span>
        </span>
      )}
    </motion.div>
  );
}
