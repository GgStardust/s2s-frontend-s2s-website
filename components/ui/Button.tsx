import Link from 'next/link';
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  href?: string;
  variant?: 'primary' | 'secondary' | 'tertiary';
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  external?: boolean;
  disabled?: boolean;
}

export default function Button({
  children,
  href,
  variant = 'primary',
  onClick,
  className = '',
  type = 'button',
  external = false,
  disabled = false,
}: ButtonProps) {
  const baseClasses =
    'px-6 py-3 rounded-sm font-medium transition-colors inline-block text-center disabled:opacity-50 disabled:pointer-events-none font-sans text-sm sm:text-base';

  const variantClasses = {
    primary:
      'bg-stone-200 text-cosmic-blue hover:bg-stone-100 border border-stone-300/40 focus:outline-2 focus:outline-stone-400/50 focus:outline-offset-2',
    secondary:
      'bg-transparent text-stone-200 border border-stone-400/35 hover:border-stone-300/60 hover:bg-stone-400/5 focus:outline-2 focus:outline-stone-400/50 focus:outline-offset-2',
    tertiary:
      'text-stone-300 hover:text-stone-100 underline underline-offset-4 focus:outline-2 focus:outline-stone-400/50 focus:outline-offset-2',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  if (href) {
    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}
