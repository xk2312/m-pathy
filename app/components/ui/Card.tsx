import * as React from 'react'

export const Card = ({ className = '', children }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`rounded-xl border border-border-soft bg-surface1 shadow-sm ${className}`}>
    {children}
  </div>
)

export const CardContent = ({
  className = '',
  children,
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`p-3 ${className}`}>{children}</div>
)
