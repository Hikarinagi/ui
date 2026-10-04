'use client'

import { ArrowUp } from 'lucide-react'
import { useImperativeHandle, useRef, type FocusEvent, type MouseEvent } from 'react'
import { hasContent } from '../../lib/content'
import { lucide } from '../../lib/icon'
import { useUiLocale } from '../../locale'
import { FloatButton } from '../float-button/FloatButton'
import { useScrollTop } from './hooks/useScrollTop'
import type { ScrollTopProps } from './types'

const ArrowUpIcon = lucide(ArrowUp)

export function ScrollTop(props: ScrollTopProps) {
  const {
    label,
    target: _target,
    threshold: _threshold,
    behavior: _behavior,
    focusTarget: _focusTarget,
    tooltip = true,
    ripple = true,
    variant = 'outline',
    tone = 'neutral',
    position,
    placement,
    offset,
    size,
    shape,
    extended,
    tooltipSide,
    disabled,
    loading,
    className,
    style,
    children,
    onClick,
    onFocus,
    onBlur,
    ref,
    ...attrs
  } = props
  const t = useUiLocale()
  const scroll = useScrollTop(props)
  const visible = useRef(scroll.visible)
  visible.current = scroll.visible

  useImperativeHandle(
    ref,
    () => ({
      get visible() {
        return visible.current
      },
      scrollToTop: scroll.scrollToTop,
    }),
    [scroll.scrollToTop],
  )

  function activate(event: MouseEvent<HTMLElement>) {
    onClick?.(event)
    if (!event.defaultPrevented) scroll.scrollToTop()
  }

  return (
    <FloatButton
      visible={scroll.visible}
      {...attrs}
      data-hn-scroll-top=""
      label={label ?? t.scroll.backToTop}
      position={position}
      placement={placement}
      offset={offset}
      size={size}
      shape={shape}
      extended={extended}
      variant={variant}
      tone={tone}
      tooltip={tooltip}
      tooltipSide={tooltipSide}
      disabled={disabled}
      loading={loading}
      ripple={ripple}
      className={className}
      style={style}
      onClick={activate}
      onFocus={(event: FocusEvent<HTMLElement>) => {
        onFocus?.(event)
        scroll.onFocus(event)
      }}
      onBlur={(event: FocusEvent<HTMLElement>) => {
        onBlur?.(event)
        scroll.onBlur()
      }}
    >
      {hasContent(children) ? children : <ArrowUpIcon />}
    </FloatButton>
  )
}
