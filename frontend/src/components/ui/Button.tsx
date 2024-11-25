import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  as?: typeof Link;
  to?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      children,
      isLoading,
      variant = 'primary',
      as,
      to,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary:
        'bg-belgian-yellow text-belgian-black hover:bg-yellow-400 focus:ring-yellow-500',
      secondary:
        'bg-belgian-black text-white hover:bg-gray-800 focus:ring-gray-500',
      outline:
        'border-2 border-belgian-yellow text-belgian-black hover:bg-belgian-yellow focus:ring-yellow-500',
    };

    const combinedClassName = `${baseStyles} ${variants[variant]} ${className}`;

    if (as === Link && to) {
      return (
        <Link to={to} className={combinedClassName}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {children}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        className={combinedClassName}
        disabled={isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
