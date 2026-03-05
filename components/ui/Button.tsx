import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'md' | 'lg';
  href?: string;
  onClick?: () => void;
}

export default function Button({ children, variant = 'primary', size = 'md', href, onClick }: ButtonProps) {
  const base = 'min-h-[44px] px-5 font-semibold rounded-[var(--r-xl)] transition-all duration-150 focus-visible:outline focus-visible:outline-2';
  const variants = {
    primary: 'bg-gradient-to-r from-[var(--blue)] to-[var(--violet)] text-white shadow-[var(--shadow-glow)] border border-[var(--border-1)] hover:scale-[1.02] active:scale-[0.99] hover:shadow-[var(--shadow-deep)]',
    secondary: 'bg-[rgba(255,255,255,0.08)] backdrop-blur border border-[var(--border-0)] text-[var(--text-0)] hover:border-[var(--border-1)]',
  };
  const sizes = {
    md: 'text-[16px] min-w-[120px]',
    lg: 'text-[18px] min-w-[160px]',
  };
  const className = `${base} ${variants[variant]} ${sizes[size]}`;

  if (href) {
    return (
      <a href={href} className={className} tabIndex={0}>
        <motion.span initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: 'easeInOut' }}>{children}</motion.span>
      </a>
    );
  }
  return (
    <button className={className} onClick={onClick} tabIndex={0}>
      <motion.span initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: 'easeInOut' }}>{children}</motion.span>
    </button>
  );
}
