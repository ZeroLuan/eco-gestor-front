import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onCheckedChange?: (checked: boolean) => void;
}

export const Checkbox = ({ 
  onCheckedChange, 
  className = '', 
  onChange,
  ...props 
}: CheckboxProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onCheckedChange) {
      onCheckedChange(e.target.checked);
    }
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <input 
      type="checkbox"
      className={`form-check-input ${className}`} 
      onChange={handleChange}
      {...props}
    />
  );
};
