'use client';

import { motion } from 'motion/react';

import { cn } from '@/lib/utils';

export function ScrollIndicator({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'h-12 w-6',
        'flex justify-center',
        // Use neutral colors instead of primary to avoid sky tint
        'border-2 border-neutral-400/50 dark:border-neutral-200/50 rounded-lg py-2',
        className,
      )}
    >
      <motion.div
        className={cn('w-2 h-2 rounded-full bg-neutral-900/60 dark:bg-white/80')}
        animate={{
          opacity: [1, 0],
          y: [0, 24],
        }}
        transition={{
          duration: 1.5,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: 'loop',
          repeatDelay: 0.5,
        }}
      />
    </div>
  );
}
