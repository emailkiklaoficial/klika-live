'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SkeletonGrid — Loading skeletons for feeds
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface SkeletonGridProps {
  count?: number;
  type?: 'product' | 'live' | 'auction';
  className?: string;
}

function ProductSkeleton() {
  return (
    <div className="space-y-3">
      {/* Image */}
      <Skeleton className="aspect-square w-full rounded-xl" />
      {/* Title */}
      <div className="space-y-2 px-1">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        {/* Price */}
        <Skeleton className="h-5 w-1/3" />
        {/* Seller row */}
        <div className="flex items-center gap-2">
          <Skeleton className="size-6 rounded-full" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </div>
  );
}

function LiveSkeleton() {
  return (
    <div className="space-y-3">
      {/* Thumbnail */}
      <Skeleton className="aspect-[4/3] w-full rounded-xl" />
      {/* Title */}
      <div className="space-y-2 px-1">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}

function AuctionSkeleton() {
  return (
    <div className="space-y-3">
      {/* Image */}
      <Skeleton className="aspect-square w-full rounded-xl" />
      {/* Badge */}
      <Skeleton className="mx-1 h-5 w-20 rounded-full" />
      {/* Timer */}
      <div className="mx-1 flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-10 rounded-md" />
        ))}
      </div>
 {/* Bid */}
      <Skeleton className="mx-1 h-6 w-2/5" />
      {/* Seller */}
      <div className="mx-1 flex items-center gap-2">
        <Skeleton className="size-6 rounded-full" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}

const skeletonMap = {
  product: ProductSkeleton,
  live: LiveSkeleton,
  auction: AuctionSkeleton,
} as const;

export default function SkeletonGrid({
  count = 6,
  type = 'product',
  className,
}: SkeletonGridProps) {
  const SkeletonComponent = skeletonMap[type];

  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
        type === 'live' && 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
        className
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <SkeletonComponent />
        </div>
      ))}
    </div>
  );
}
