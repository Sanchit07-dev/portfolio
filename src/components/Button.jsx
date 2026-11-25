import { motion } from 'framer-motion';

const variants = {
  primary: 'inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 text-white font-medium hover:bg-orange-600 active:scale-95 shadow-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-500',
  secondary: 'inline-flex items-center justify-center gap-2 rounded-xl bg-white border border-neutral-200 text-neutral-900 font-medium hover:border-orange-500/50 hover:bg-neutral-50 active:scale-95 shadow-subtle focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-500',
  ghost: 'inline-flex items-center justify-center gap-2 rounded-xl text-neutral-600 hover:text-orange-600 hover:bg-orange-500/5 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-500',
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  href,
  target,
  rel,
  type = 'button',
  disabled = false,
  ...props
}) {
  const baseClass = `${variants[variant]} ${sizes[size]} transition-all duration-200 ${disabled ? 'opacity-50 pointer-events-none' : ''} ${className}`;

  const motionProps = {
    whileHover: { scale: disabled ? 1 : 1.015 },
    whileTap: { scale: disabled ? 1 : 0.98 },
  };

  if (href) {
    return (
      <motion.a
        href={href}
        target={target}
        rel={rel || (target === '_blank' ? 'noopener noreferrer' : undefined)}
        className={baseClass}
        {...motionProps}
        {...props}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseClass}
      {...motionProps}
      {...props}
    >
      {children}
    </motion.button>
  );
}
