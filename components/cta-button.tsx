'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface CTAButtonProps extends React.ComponentProps<'button'> {
  iridescent?: boolean;
}

export function CTAButton({ 
  children, 
  iridescent = true, 
  className, 
  ...props 
}: CTAButtonProps) {
  return (
    <Button
      className={cn(
        'relative overflow-hidden',
        iridescent && 'bg-white text-black hover:bg-white/90',
        className
      )}
      {...props}
    >
      <span className={cn(iridescent && 'iridescent font-semibold')}>
        {children}
      </span>
    </Button>
  );
}