'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { VariantProps } from 'class-variance-authority';
import { buttonVariants } from '@/components/ui/button';

interface CTAButtonProps extends React.ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
  iridescent?: boolean;
  asChild?: boolean;
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
