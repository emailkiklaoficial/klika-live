'use client';

import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LiveStream } from '@/types';
import { useNavigationStore } from '@/stores';
import UserAvatar from '@/components/shared/UserAvatar';
import LiveBadge from '@/components/shared/LiveBadge';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LiveCard — Live stream card with overlays
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface LiveCardProps {
  stream: LiveStream;
  className?: string;
}

function formatDuration(seconds?: number): string {
  if (!seconds) return '';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function calcTimeUntilStart(startedAt: string): string | null {
  const diff = new Date(startedAt).getTime() - Date.now();
  if (diff <= 0) return null; // already started or passed
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  if (hours > 24) return `Starts in ${Math.floor(hours / 24)}d`;
  if (hours > 0) return `Starts in ${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `Starts in ${minutes}m`;
  return 'Starting soon';
}

export default function LiveCard({ stream, className }: LiveCardProps) {
  const navigate = useNavigationStore((s) => s.navigate);

  const handleClick = () => {
    if (stream.status === 'live') {
      navigate('live', { id: stream.id });
    }
  };

  const isUpcoming = stream.status === 'upcoming';
  const isEnded = stream.status === 'ended';
  const timeUntil = isUpcoming ? calcTimeUntilStart(stream.startedAt) : null;

  return (
    <motion.div
      className={cn('flex flex-col', className)}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div
        className={cn(
          'relative cursor-pointer overflow-hidden rounded-xl bg-muted shadow-md transition-shadow hover:shadow-xl',
          isEnded && 'opacity-60 pointer-events-none'
        )}
        onClick={handleClick}
      >
        {/* ─── Thumbnail ─── */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={stream.thumbnail}
            alt={stream.title}
            className="size-full object-cover transition-transform duration-500"
            loading="lazy"
          />

          {/* Dark gradient overlay at bottom */}
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* ─── Top-left: Seller info ─── */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-2 rounded-full bg-black/40 px-2 py-1 backdrop-blur-sm">
            <UserAvatar user={stream.seller} size="sm" />
            <span className="text-xs font-semibold text-white drop-shadow-sm">
              {stream.seller.displayName}
            </span>
          </div>

          {/* ─── Top-right: Status badges ─── */}
          <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 items-end">
            {stream.status === 'live' && (
              <LiveBadge viewerCount={stream.viewerCount} size="sm" />
            )}

            {isUpcoming && (
              <motion.span
                className="rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-md"
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                ⏰ STARTING SOON
              </motion.span>
            )}

            {isEnded && (
              <span className="rounded-full bg-muted-foreground px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-background shadow-md">
                ENDED
              </span>
            )}
          </div>

          {/* ─── Upcoming: countdown text ─── */}
          {isUpcoming && timeUntil && (
            <div className="absolute top-12 right-2.5">
              <span className="rounded-lg bg-black/50 px-2 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
                {timeUntil}
              </span>
            </div>
          )}

          {/* ─── Bottom: Title overlay ─── */}
          <div className="absolute inset-x-0 bottom-0 p-2.5 sm:p-3">
            <h3 className="line-clamp-2 text-sm font-bold leading-snug text-white drop-shadow-md sm:text-[15px]">
              {stream.title}
            </h3>

            {/* Duration / Category */}
            <div className="mt-1 flex items-center gap-2">
              {stream.duration && (
                <span className="flex items-center gap-1 text-[10px] text-white/60">
                  <Clock size={10} />
                  {formatDuration(stream.duration)}
                </span>
              )}
              <span className="rounded-full bg-white/15 px-1.5 py-px text-[9px] font-medium text-white/70">
                {stream.category}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
