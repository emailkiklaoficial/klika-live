'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Gavel,
  Radio,
  Heart,
  Package,
  BellRing,
  CheckCheck,
  Trash2,
  Inbox,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockNotifications } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Notification, NotificationType } from '@/types';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// NotificationsView — Notifications list
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const filterTabs = [
  { id: 'all', label: 'All' },
  { id: 'bids', label: 'Bids' },
  { id: 'lives', label: 'Lives' },
  { id: 'sales', label: 'Sales' },
] as const;

// Notification icon mapping
function getNotificationIcon(type: NotificationType) {
  const iconMap: Record<NotificationType, {
    icon: React.ReactNode;
    bgClass: string;
  }> = {
    bid: {
      icon: <Gavel size={16} className="text-amber-600" />,
      bgClass: 'bg-amber-100 dark:bg-amber-900/30',
    },
    live: {
      icon: <Radio size={16} className="text-rose-600" />,
      bgClass: 'bg-rose-100 dark:bg-rose-900/30',
    },
    follow: {
      icon: <Heart size={16} className="text-pink-600" />,
      bgClass: 'bg-pink-100 dark:bg-pink-900/30',
    },
    sale: {
      icon: <Package size={16} className="text-emerald-600" />,
      bgClass: 'bg-emerald-100 dark:bg-emerald-900/30',
    },
    auction: {
      icon: <Gavel size={16} className="text-violet-600" />,
      bgClass: 'bg-violet-100 dark:bg-violet-900/30',
    },
    system: {
      icon: <BellRing size={16} className="text-sky-600" />,
      bgClass: 'bg-sky-100 dark:bg-sky-900/30',
    },
  };
  return iconMap[type];
}

// Time ago formatter
function timeAgo(timestamp: string): string {
  const now = Date.now();
  const then = new Date(timestamp).getTime();
  const diffMs = now - then;

  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMs / 3600000);
  const days = Math.floor(diffMs / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
}

// Notification item component
function NotificationItem({
  notification,
  onRead,
  onDismiss,
}: {
  notification: Notification;
  onRead: (id: string) => void;
  onDismiss: (id: string) => void;
}) {
  const [isSwiping, setIsSwiping] = useState(false);
  const { icon, bgClass } = getNotificationIcon(notification.type);

  return (
    <motion.div
      className={cn(
        'relative flex items-start gap-3 rounded-xl border transition-colors',
        notification.isRead
          ? 'border-border/30 bg-background'
          : 'border-primary/10 bg-primary/[0.03]'
      )}
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300, height: 0, marginBottom: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 26 }}
      onClick={() => !notification.isRead && onRead(notification.id)}
    >
      {/* ─── Icon ─── */}
      <div
        className={cn(
          'mt-1 flex size-10 shrink-0 items-center justify-center rounded-full',
          bgClass
        )}
      >
        {icon}
      </div>

      {/* ─── Content ─── */}
      <div className="flex flex-1 flex-col gap-1 overflow-hidden py-2 pr-2">
        <div className="flex items-start justify-between gap-2">
          <h4
            className={cn(
              'text-sm font-semibold leading-snug',
              notification.isRead ? 'text-foreground' : 'text-foreground'
            )}
          >
            {notification.title}
          </h4>
          {!notification.isRead && (
            <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" />
          )}
        </div>
        <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {notification.message}
        </p>
        <div className="flex items-center gap-2 pt-0.5">
          <span className="text-[10px] font-medium text-muted-foreground/60">
            {timeAgo(notification.timestamp)}
          </span>
          {notification.imageUrl && (
            <img
              src={notification.imageUrl}
              alt=""
              className="size-6 rounded-md object-cover"
              loading="lazy"
            />
          )}
        </div>
      </div>

      {/* ─── Dismiss button ─── */}
      <motion.button
        className="mt-1 shrink-0 rounded-lg p-1.5 text-muted-foreground/30 opacity-0 transition-all hover:bg-muted hover:text-muted-foreground group-hover:opacity-100 focus:opacity-100"
        onClick={(e) => {
          e.stopPropagation();
          onDismiss(notification.id);
        }}
        whileTap={{ scale: 0.9 }}
      >
        <Trash2 size={14} />
      </motion.button>
    </motion.div>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
};

export default function NotificationsView() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [activeFilter, setActiveFilter] = useState('all');

  // Filter notifications
  const filteredNotifications = useMemo(() => {
    if (activeFilter === 'all') return notifications;

    const filterMap: Record<string, NotificationType[]> = {
      bids: ['bid', 'auction'],
      lives: ['live'],
      sales: ['sale'],
    };

    const types = filterMap[activeFilter];
    if (!types) return notifications;
    return notifications.filter((n) => types.includes(n.type));
  }, [notifications, activeFilter]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, isRead: true }))
    );
  };

  const markRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <motion.div
      className="px-4 py-4 sm:px-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          HEADER
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <motion.div
        className="flex items-center justify-between"
        variants={itemVariants}
      >
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-foreground sm:text-2xl">
            Notifications
          </h1>
          {unreadCount > 0 && (
            <Badge className="h-5 min-w-5 px-1.5 text-[10px]">
              {unreadCount}
            </Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            'gap-1.5 text-xs font-medium transition-colors',
            unreadCount > 0
              ? 'text-primary hover:text-primary'
              : 'text-muted-foreground'
          )}
          onClick={markAllRead}
          disabled={unreadCount === 0}
        >
          <CheckCheck size={14} />
          Mark all read
        </Button>
      </motion.div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          FILTER TABS
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <motion.div
        className="mt-4 flex gap-1.5 rounded-xl bg-muted p-1"
        variants={itemVariants}
      >
        {filterTabs.map((tab) => (
          <motion.button
            key={tab.id}
            className={cn(
              'relative flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition-colors',
              activeFilter === tab.id
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveFilter(tab.id)}
          >
            {tab.label}
            {tab.id !== 'all' && (
              <span className="ml-1 text-[10px] text-muted-foreground/60">
                (
                {tab.id === 'bids'
                  ? notifications.filter(
                      (n) => n.type === 'bid' || n.type === 'auction'
                    ).length
                  : tab.id === 'lives'
                    ? notifications.filter((n) => n.type === 'live').length
                    : notifications.filter((n) => n.type === 'sale').length}
                )
              </span>
            )}
          </motion.button>
        ))}
      </motion.div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          NOTIFICATIONS LIST
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="mt-4 space-y-2">
        <AnimatePresence mode="popLayout">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onRead={markRead}
                onDismiss={dismissNotification}
              />
            ))
          ) : (
            <motion.div
              key="empty"
              className="flex flex-col items-center justify-center gap-4 py-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex items-center justify-center rounded-full bg-muted p-4">
                <Inbox size={32} className="text-muted-foreground" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-foreground">
                  {activeFilter === 'all'
                    ? 'All caught up!'
                    : `No ${activeFilter} notifications`}
                </h3>
                <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                  {activeFilter === 'all'
                    ? "You're all up to date. We'll let you know when something happens."
                    : `You don't have any ${activeFilter} notifications right now.`}
                </p>
              </div>
              {notifications.length > 0 && activeFilter !== 'all' && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 rounded-xl"
                  onClick={() => setActiveFilter('all')}
                >
                  View all notifications
                </Button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom spacer */}
      <div className="h-4" />
    </motion.div>
  );
}
