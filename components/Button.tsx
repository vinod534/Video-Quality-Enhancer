import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  isLoading = false,
  icon,
  className = '',
  disabled,
  ...props 
}) => {
  const baseStyles = "relative inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:pointer-events-none overflow-hidden group";
  
  const variants = {
    primary: "bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_rgba(8,145,178,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] border border-cyan-400/50",
    secondary: "bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white border border-slate-700 hover:border-slate-600",
    outline: "border border-slate-700 bg-transparent text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 hover:bg-slate-900/50 shadow-none hover:shadow-[0_0_15px_rgba(6,182,212,0.1)]",
    danger: "bg-red-900/20 text-red-400 hover:bg-red-900/40 border border-red-900/50 hover:border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.1)]",
  };

  const sizes = {
    sm: "h-9 px-3 text-xs tracking-wide",
    md: "h-11 px-5 text-sm tracking-wide",
    lg: "h-14 px-8 text-base tracking-widest uppercase",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {/* Button Glint Effect */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
      
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : icon ? (
        <span className="mr-2 group-hover:text-cyan-200 transition-colors">{icon}</span>
      ) : null}
      <span className="relative z-10">{children}</span>
    </button>
  );
};