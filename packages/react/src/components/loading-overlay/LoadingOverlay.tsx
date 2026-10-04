'use client'

import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { hasContent } from '../../lib/content'
import { Transition } from '../../lib/transition/Transition'
import { Spinner } from '../spinner/Spinner'
import type { SpinnerVariants } from '../spinner/spinner.variants'
import { Text } from '../text/Text'
import { useDelayedVisible } from './hooks/useDelayedVisible'
import { loadingBlocker, loadingOverlay } from './loading-overlay.variants'

export interface LoadingOverlayProps {
  visible?: boolean
  text?: string
  fixed?: boolean
  size?: SpinnerVariants['size']
  delay?: number
  minVisible?: number
  className?: string
  children?: ReactNode
}

export function LoadingOverlay({
  visible = false,
  text,
  fixed = false,
  size = 'md',
  delay = 300,
  minVisible = 300,
  className,
  children,
}: LoadingOverlayProps) {
  const shown = useDelayedVisible(visible, delay, minVisible)
  return (
    <>
      {visible && !shown && (
        <div data-hn-loading-blocker="" aria-hidden="true" className={loadingBlocker({ fixed })} />
      )}
      <Transition
        show={shown}
        enterActiveClass="hn-transition-base"
        enterFromClass="opacity-0"
        leaveActiveClass="hn-transition"
        leaveToClass="opacity-0"
      >
        <div data-hn-loading-overlay="" className={cn(loadingOverlay({ fixed }), className)}>
          {hasContent(children) ? (
            children
          ) : (
            <>
              <Spinner size={size} label={text} />
              {text && (
                <Text size="sm" tone="muted" aria-hidden="true">
                  {text}
                </Text>
              )}
            </>
          )}
        </div>
      </Transition>
    </>
  )
}
