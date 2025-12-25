import React, { useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import styles from './Modal.module.css'

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

export interface ModalProps {
  /** Открыто ли модальное окно */
  isOpen: boolean
  /** Callback закрытия */
  onClose: () => void
  /** Заголовок */
  title?: React.ReactNode
  /** Размер */
  size?: ModalSize
  /** Закрытие по клику на оверлей */
  closeOnOverlay?: boolean
  /** Закрытие по Escape */
  closeOnEscape?: boolean
  /** Показать кнопку закрытия */
  showCloseButton?: boolean
  /** Контент футера */
  footer?: React.ReactNode
  /** Дочерние элементы */
  children?: React.ReactNode
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  size = 'md',
  closeOnOverlay = true,
  closeOnEscape = true,
  showCloseButton = true,
  footer,
  children,
}) => {
  // Handle Escape key
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape' && closeOnEscape) {
        onClose()
      }
    },
    [onClose, closeOnEscape]
  )

  // Handle overlay click
  const handleOverlayClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget && closeOnOverlay) {
        onClose()
      }
    },
    [onClose, closeOnOverlay]
  )

  // Add/remove event listeners and body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen) return null

  const modalContent = (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div 
        className={`${styles.modal} ${styles[`size-${size}`]}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        {(title || showCloseButton) && (
          <div className={styles.header}>
            {title && (
              <h2 id="modal-title" className={styles.title}>
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                type="button"
                className={styles.closeButton}
                onClick={onClose}
                aria-label="Закрыть"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        )}
        <div className={styles.body}>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}

export default Modal
