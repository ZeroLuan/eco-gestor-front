import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  children: React.ReactNode;
}

export const Button = ({ 
  variant = 'primary', 
  className = '', 
  children, 
  ...props 
}: ButtonProps) => {
  const variantClass = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline-primary'
  }[variant];

  return (
    <button 
      className={`btn ${variantClass} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};
