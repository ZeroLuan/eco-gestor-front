import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <input 
        className={`form-control ${className}`} 
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
