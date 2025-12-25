import React from 'react'
import styles from './StatusIndicator.module.css'

export type StatusType = 
  | 'online' 
  | 'offline' 
  | 'pending' 
  | 'on-way' 
  | 'completed' 
  | 'archived'
  | 'overload'
  | 'created'
  | 'changed-driver'

export type StatusSize = 'sm' | 'md' | 'lg'

export interface StatusIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Тип статуса */
  status: StatusType
  /** Размер */
  size?: StatusSize
  /** Иконка внутри */
  icon?: React.ReactNode
  /** Показать пульсацию (для online) */
  pulse?: boolean
}

export const StatusIndicator = React.forwardRef<HTMLDivElement, StatusIndicatorProps>(
  (
    {
      status,
      size = 'md',
      icon,
      pulse = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const classNames = [
      styles.indicator,
      styles[`status-${status}`],
      styles[`size-${size}`],
      pulse && styles.pulse,
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <div ref={ref} className={classNames} {...props}>
        {icon}
      </div>
    )
  }
)

StatusIndicator.displayName = 'StatusIndicator'

export default StatusIndicator
