'use client';

import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CTAButtonProps extends ButtonProps {
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
