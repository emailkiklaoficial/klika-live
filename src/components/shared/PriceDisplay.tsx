'use client';

import { cn } from '@/lib/utils';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PriceDisplay — Premium price with discount badge
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface PriceDisplayProps {
  price: number;
  originalPrice?: number;
  currency?: string;
  size?: 'sm' | 'md' | 'lg';
  showBadge?: boolean;
  className?: string;
}

const sizeClasses: Record<NonNullable<PriceDisplayProps['size']>, { main: string; original: string; badge: string }> = {
  sm: {
    main: 'text-sm font-bold',
    original: 'text-[10px]',
    badge: 'text-[9px] px-1 py-px',
  },
  md: {
    main: 'text-lg font-bold',
    original: 'text-xs',
    badge: 'text-[10px] px-1.5 py-0.5',
  },
  lg: {
    main: 'text-2xl font-extrabold sm:text-3xl',
    original: 'text-sm',
    badge: 'text-[10px] px-2 py-0.5',
  },
};

function formatPrice(amount: number, currency: string): string {
  return `${currency}${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

function calcDiscount(price: number, original: number): number {
  if (original <= 0 || price >= original) return 0;
  return Math.round(((original - price) / original) * 100);
}

export default function PriceDisplay({
  price,
  originalPrice,
  currency = '$',
  size = 'md',
  showBadge = true,
  className,
}: PriceDisplayProps) {
  const discount = originalPrice ? calcDiscount(price, originalPrice) : 0;
  const cls = sizeClasses[size];

  return (
    <div className={cn('flex flex-wrap items-center gap-1.5', className)}>
      <span
        className={cn(
          'font-mono tabular-nums',
          cls.main,
          'text-rose-600'
        )}
      >
        {formatPrice(price, currency)}
      </span>

      {originalPrice && originalPrice > price && (
        <span
          className={cn(
            'font-mono tabular-nums line-through text-muted-foreground',
            cls.original
          )}
        >
          {formatPrice(originalPrice, currency)}
        </span>
      )}

      {showBadge && discount > 0 && (
        <span
          className={cn(
            'rounded-full bg-emerald-500/10 font-semibold text-emerald-600',
            cls.badge
          )}
        >
          -{discount}%
        </span>
      )}
    </div>
  );
}
