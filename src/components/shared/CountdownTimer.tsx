'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CountdownTimer — Premium auction countdown
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface CountdownTimerProps {
  targetDate: string;
  compact?: boolean;
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
  isExpired: boolean;
}

function calcTimeLeft(target: string): TimeLeft {
  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0, isExpired: true };
  }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    totalMs: diff,
    isExpired: false,
  };
}

function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

export default function CountdownTimer({ targetDate, compact = false, className }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calcTimeLeft(targetDate));
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimeLeft(calcTimeLeft(targetDate));
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [targetDate]);

  const isUrgent = timeLeft.totalMs > 0 && timeLeft.totalMs < 60 * 60 * 1000; // < 1 hour
  const isCritical = timeLeft.totalMs > 0 && timeLeft.totalMs < 5 * 60 * 1000; // < 5 min

  // ─── Expired ───
  if (timeLeft.isExpired) {
    return (
      <div className={cn('flex items-center gap-1 font-mono', className)}>
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          Ended
        </span>
      </div>
    );
  }

  // ─── Compact mode: "2h 34m" ───
  if (compact) {
    const parts: string[] = [];
    if (timeLeft.days > 0) parts.push(`${timeLeft.days}d`);
    parts.push(`${timeLeft.hours}h`);
    parts.push(`${timeLeft.minutes}m`);
    if (timeLeft.days === 0) parts.push(`${timeLeft.seconds}s`);

    return (
      <motion.span
        className={cn(
          'font-mono text-xs font-semibold tabular-nums',
          isCritical
            ? 'text-rose-600'
            : isUrgent
              ? 'text-rose-500'
              : 'text-foreground',
          className
        )}
        animate={isCritical ? { scale: [1, 1.05, 1] } : {}}
        transition={isCritical ? { repeat: Infinity, duration: 0.8 } : {}}
      >
        {parts.join(' ')}
      </motion.span>
    );
  }

  // ─── Full mode: DD : HH : MM : SS with labels ───
  const units = [
    { value: timeLeft.days, label: 'Days' },
    { value: timeLeft.hours, label: 'Hrs' },
    { value: timeLeft.minutes, label: 'Min' },
    { value: timeLeft.seconds, label: 'Sec' },
  ];

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <AnimatePresence mode="wait">
        {isCritical && (
          <motion.span
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mr-1.5 rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-600"
          >
            ⚡ ENDING SOON
          </motion.span>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-1">
        {units.map((unit, i) => (
          <div key={unit.label} className="flex items-center">
            <div
              className={cn(
                'flex flex-col items-center',
                isCritical && 'animate-pulse'
              )}
            >
              <span
                className={cn(
                  'font-mono text-base font-bold leading-none tabular-nums sm:text-lg',
                  isCritical
                    ? 'text-rose-600'
                    : isUrgent
                      ? 'text-rose-500'
                      : 'text-foreground'
                )}
              >
                {pad(unit.value)}
              </span>
              <span className="mt-0.5 text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
                {unit.label}
              </span>
            </div>
            {i < units.length - 1 && (
              <span className="mx-0.5 text-sm font-bold text-muted-foreground/50">:</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
