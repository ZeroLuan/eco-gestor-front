import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className = '' }: CardProps) => {
  return (
    <div className={`card ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }: CardProps) => {
  return (
    <div className={`card-header ${className}`}>
      {children}
    </div>
  );
};

export const CardContent = ({ children, className = '' }: CardProps) => {
  return (
    <div className={`card-body ${className}`}>
      {children}
    </div>
  );
};

export const CardTitle = ({ children, className = '' }: CardProps) => {
  return (
    <h5 className={`card-title ${className}`}>
      {children}
    </h5>
  );
};

export const CardDescription = ({ children, className = '' }: CardProps) => {
  return (
    <p className={`card-text text-muted ${className}`}>
      {children}
    </p>
  );
};
