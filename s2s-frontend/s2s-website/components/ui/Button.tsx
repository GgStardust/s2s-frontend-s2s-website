import Link from 'next/link';
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  href?: string;
  variant?: 'primary' | 'secondary' | 'tertiary';
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export default function Button({
  children,
  href,
  variant = 'primary',
  onClick,
  className = '',
  type = 'button',
}: ButtonProps) {
  const baseClasses = 'px-6 py-3 rounded-md font-medium transition-colors';
  
  const variantClasses = {
    primary: 'bg-cyan-500 text-cosmic-blue hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/50 focus:outline-2 focus:outline-cyan-300 focus:outline-offset-2 transition-all font-semibold',
    secondary: 'bg-cosmic-blue text-cyan-300 hover:bg-cyan-400/10 focus:outline-2 focus:outline-cyan-300 focus:outline-offset-2 transition-all',
    tertiary: 'text-cyan-300 hover:text-cyan-200 hover:underline underline-offset-4 focus:outline-2 focus:outline-cyan-300 focus:outline-offset-2 transition-colors',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
