'use client';

import { motion } from 'framer-motion';
import { BadgeCheck } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// UserAvatar — Verified user avatar with badge
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface UserAvatarProps {
  user: {
    avatar: string;
    isVerified?: boolean;
    displayName?: string;
  };
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap: Record<NonNullable<UserAvatarProps['size']>, string> = {
  sm: 'size-6',
  md: 'size-8',
  lg: 'size-10',
  xl: 'size-14',
};

const badgeSizeMap: Record<NonNullable<UserAvatarProps['size']>, string> = {
  sm: 'size-3',
  md: 'size-3.5',
  lg: 'size-4',
  xl: 'size-5',
};

const badgeIconSize: Record<NonNullable<UserAvatarProps['size']>, number> = {
  sm: 8,
  md: 10,
  lg: 12,
  xl: 14,
};

const initials = (name?: string): string => {
  if (!name) return '?';
  const parts = name.replace(/[^\w\s]/g, '').split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export default function UserAvatar({ user, size = 'md', className }: UserAvatarProps) {
  return (
    <motion.div
      className={cn('relative inline-flex shrink-0', className)}
      whileHover={{ scale: 1.08 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
    >
      <Avatar className={cn('ring-2 ring-background', sizeMap[size])}>
        <AvatarImage src={user.avatar} alt={user.displayName ?? ''} />
        <AvatarFallback className="bg-muted text-[10px] font-semibold text-muted-foreground sm:text-xs">
          {initials(user.displayName)}
        </AvatarFallback>
      </Avatar>

      {user.isVerified && (
        <div
          className={cn(
            'absolute -bottom-0.5 -right-0.5 flex items-center justify-center rounded-full bg-emerald-500 ring-2 ring-background',
            badgeSizeMap[size]
          )}
        >
          <BadgeCheck
            className="text-white"
            size={badgeIconSize[size]}
            strokeWidth={2.5}
          />
        </div>
      )}
    </motion.div>
  );
}
