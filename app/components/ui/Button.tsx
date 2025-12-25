import * as React from 'react'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'solid' | 'ghost'
}

export const Button = ({ variant = 'solid', className = '', ...props }: ButtonProps) => {
  const base =
    variant === 'ghost'
      ? 'text-secondary hover:text-primary'
      : 'bg-cyan-500 text-black hover:bg-cyan-400'
  return (
    <button
      {...props}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${base} ${className}`}
    />
  )
}
