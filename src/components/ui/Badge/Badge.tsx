import React from 'react'
import styles from './Badge.module.css'

export type BadgeVariant = 
  | 'default' 
  | 'primary' 
  | 'secondary' 
  | 'success' 
  | 'warning' 
  | 'danger' 
  | 'info'
  | 'online'
  | 'offline'
  | 'pending'

export type BadgeSize = 'sm' | 'md' | 'lg'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Вариант стиля */
  variant?: BadgeVariant
  /** Размер */
  size?: BadgeSize
  /** Стиль пилюли (полностью скруглённый) */
  pill?: boolean
  /** Точка вместо текста */
  dot?: boolean
  /** Иконка слева */
  icon?: React.ReactNode
  /** Дочерние элементы */
  children?: React.ReactNode
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = 'default',
      size = 'md',
      pill = false,
      dot = false,
      icon,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const classNames = [
      styles.badge,
      styles[`variant-${variant}`],
      styles[`size-${size}`],
      pill && styles.pill,
      dot && styles.dot,
      className,
    ]
      .filter(Boolean)
      .join(' ')

    if (dot) {
      return <span ref={ref} className={classNames} {...props} />
    }

    return (
      <span ref={ref} className={classNames} {...props}>
        {icon && <span className={styles.icon}>{icon}</span>}
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'

export default Badge
