import React from 'react';
import { cn } from '../../utils';

export const Button = React.forwardRef(({ className, variant = 'primary', size = 'default', isLoading, children, ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary",
    secondary: "bg-muted text-foreground hover:bg-muted/80 focus-visible:ring-foreground",
    outline: "border border-border bg-transparent hover:bg-muted focus-visible:ring-foreground",
    ghost: "bg-transparent hover:bg-muted text-foreground focus-visible:ring-foreground",
    danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600"
  };

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-8 rounded-md px-3 text-xs",
    lg: "h-12 rounded-md px-8 text-lg",
    icon: "h-10 w-10"
  };

  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {children}
    </button>
  );
});

Button.displayName = "Button";
