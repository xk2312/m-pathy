import * as React from 'react'

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className = '', ...props }, ref) => (
  <input
    ref={ref}
    className={`px-3 py-2 rounded-md border border-border-soft bg-surface2 text-primary focus:outline-none focus:ring-1 focus:ring-cyan-500 ${className}`}
    {...props}
  />
))
Input.displayName = 'Input'
