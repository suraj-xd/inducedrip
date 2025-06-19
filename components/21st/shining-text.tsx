'use client';

import * as React from 'react';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';

export function ShiningText({
  text,
  speed,
  className
}: {
  text: string;
  speed?: number;
  className?: string;
}) {
  return (
    <motion.h1
      className={cn(
        'bg-[linear-gradient(110deg,#404040,35%,#fff,50%,#404040,75%,#404040)] bg-[length:200%_100%] bg-clip-text text-base font-regular text-transparent',
        className
      )}
      initial={{ backgroundPosition: '200% 0' }}
      animate={{ backgroundPosition: '-200% 0' }}
      transition={{
        repeat: Infinity,
        duration: speed || 2,
        ease: 'linear'
      }}
    >
      {text}
    </motion.h1>
  );
}
