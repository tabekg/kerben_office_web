import React from 'react'
import styles from './Card.module.css'

export type CardVariant = 'default' | 'outlined' | 'elevated' | 'filled'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Вариант стиля карточки */
  variant?: CardVariant
  /** Возможность клика по карточке */
  clickable?: boolean
  /** Убрать внутренние отступы */
  noPadding?: boolean
  /** Дочерние элементы */
  children?: React.ReactNode
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Заголовок */
  title?: React.ReactNode
  /** Подзаголовок */
  subtitle?: React.ReactNode
  /** Действие справа */
  action?: React.ReactNode
  /** Дочерние элементы */
  children?: React.ReactNode
}

export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Дочерние элементы */
  children?: React.ReactNode
}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Выравнивание контента */
  align?: 'left' | 'center' | 'right' | 'between'
  /** Дочерние элементы */
  children?: React.ReactNode
}

// Card Component
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      clickable = false,
      noPadding = false,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const classNames = [
      styles.card,
      styles[`variant-${variant}`],
      clickable && styles.clickable,
      noPadding && styles.noPadding,
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <div ref={ref} className={classNames} {...props}>
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

// Card Header Component
export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ title, subtitle, action, className = '', children, ...props }, ref) => {
    const classNames = [styles.header, className].filter(Boolean).join(' ')

    if (children) {
      return (
        <div ref={ref} className={classNames} {...props}>
          {children}
        </div>
      )
    }

    return (
      <div ref={ref} className={classNames} {...props}>
        <div className={styles.headerContent}>
          {title && <h3 className={styles.title}>{title}</h3>}
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        {action && <div className={styles.headerAction}>{action}</div>}
      </div>
    )
  }
)

CardHeader.displayName = 'CardHeader'

// Card Body Component
export const CardBody = React.forwardRef<HTMLDivElement, CardBodyProps>(
  ({ className = '', children, ...props }, ref) => {
    const classNames = [styles.body, className].filter(Boolean).join(' ')

    return (
      <div ref={ref} className={classNames} {...props}>
        {children}
      </div>
    )
  }
)

CardBody.displayName = 'CardBody'

// Card Footer Component
export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ align = 'right', className = '', children, ...props }, ref) => {
    const classNames = [styles.footer, styles[`align-${align}`], className]
      .filter(Boolean)
      .join(' ')

    return (
      <div ref={ref} className={classNames} {...props}>
        {children}
      </div>
    )
  }
)

CardFooter.displayName = 'CardFooter'

export default Card
