'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLiveStore } from '@/stores';
import { cn } from '@/lib/utils';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ReactionFloating — Floating emoji reactions
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface ReactionFloatingProps {
  className?: string;
}

const FLOAT_DURATION = 3.5; // seconds

export default function ReactionFloating({ className }: ReactionFloatingProps) {
  const reactions = useLiveStore((s) => s.reactions);
  const removeReaction = useLiveStore((s) => s.removeReaction);

  // Auto-remove reactions after their animation completes
  useEffect(() => {
    reactions.forEach((reaction) => {
      const timer = setTimeout(() => {
        removeReaction(reaction.id);
      }, FLOAT_DURATION * 1000 + 200);
      return () => clearTimeout(timer);
    });
  }, [reactions, removeReaction]);

  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      <AnimatePresence>
        {reactions.map((reaction) => (
          <motion.span
            key={reaction.id}
            className="absolute text-3xl sm:text-4xl"
            style={{ left: `${reaction.x}%`, bottom: '8%' }}
            initial={{ opacity: 1, y: 0, scale: 0.4 }}
            animate={{
              opacity: [1, 1, 0.8, 0],
              y: [0, -120, -240, -320],
              scale: [0.4, 1.2, 1, 0.8],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: FLOAT_DURATION,
              ease: 'easeOut',
            }}
          >
            {reaction.emoji}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}
