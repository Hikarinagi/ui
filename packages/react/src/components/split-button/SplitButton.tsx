'use client'

import { useEffect, useImperativeHandle, useRef, useState, type KeyboardEvent } from 'react'
import { useComposedRefs, useControllableState } from 'radix-ui/internal'
import { cn } from '../../lib/cn'
import { useDirection } from '../../lib/useDirection'
import { useUiLocale } from '../../locale'
import { Button } from '../button/Button'
import { ButtonGroup } from '../button-group/ButtonGroup'
import { DisclosureIcon } from '../disclosure-icon/DisclosureIcon'
import { DropdownMenu } from '../dropdown-menu/DropdownMenu'
import { splitButton, splitButtonAction } from './split-button.variants'
import type { SplitButtonProps } from './types'

export function SplitButton({
  as = 'button',
  type = 'button',
  variant = 'solid',
  tone = 'accent',
  size,
  block,
  pill,
  ripple = true,
  loading,
  disabled,
  primaryDisabled,
  menuDisabled,
  label,
  menuLabel,
  modal = true,
  dir,
  side = 'bottom',
  align = 'end',
  sideOffset = 8,
  className,
  style,
  menuClass,
  open: openProp,
  defaultOpen,
  onOpenChange,
  onClick,
  onKeyDown,
  icon,
  trailing,
  children,
  renderContent,
  ref,
  ...attrs
}: SplitButtonProps) {
  const [open = false, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange,
    caller: 'SplitButton',
  })
  const t = useUiLocale()
  const action = useRef<HTMLElement | null>(null)
  const trigger = useRef<HTMLElement | null>(null)
  const [group, setGroup] = useState<HTMLDivElement | null>(null)
  const { root, direction, rootDirection } = useDirection<HTMLDivElement>(dir)
  const groupRef = useComposedRefs(root, setGroup)
  const primaryBlocked = !!(disabled || loading || primaryDisabled)
  const menuBlocked = !!(disabled || loading || menuDisabled)
  const menuOpen = open && !menuBlocked
  const setMenuOpen = (value: boolean) => setOpen(value && !menuBlocked)
  const latest = useRef({ menuBlocked, primaryBlocked, setMenuOpen })
  latest.current = { menuBlocked, primaryBlocked, setMenuOpen }

  useEffect(() => {
    if (open && menuBlocked) setOpen(false)
  }, [open, menuBlocked, setOpen])

  function focus() {
    if (!latest.current.primaryBlocked) action.current?.focus({ preventScroll: true })
  }
  async function openMenu() {
    if (latest.current.menuBlocked) return
    trigger.current?.focus({ preventScroll: true })
    await Promise.resolve()
    if (!latest.current.menuBlocked) latest.current.setMenuOpen(true)
  }
  function closeMenu() {
    latest.current.setMenuOpen(false)
  }
  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    onKeyDown?.(event)
    if (
      event.defaultPrevented ||
      event.nativeEvent.isComposing ||
      event.key !== 'ArrowDown' ||
      menuBlocked
    )
      return
    event.preventDefault()
    void openMenu()
  }

  useImperativeHandle(ref, () => ({ focus, openMenu, closeMenu }))

  const more = menuLabel ?? t.splitButton.more

  return (
    <ButtonGroup
      ref={groupRef}
      label={label}
      dir={rootDirection}
      divider={variant !== 'outline'}
      className={cn(splitButton({ block }), className)}
      style={style}
      data-hn-split-button=""
      aria-busy={loading || undefined}
    >
      <Button
        ref={action}
        {...attrs}
        data-hn-split-action=""
        as={as}
        type={type}
        variant={variant}
        tone={tone}
        size={size}
        pill={pill}
        ripple={ripple}
        loading={loading}
        disabled={primaryBlocked}
        className={splitButtonAction()}
        icon={icon}
        trailing={trailing}
        onClick={event => onClick?.(event)}
        onKeyDown={handleKeyDown}
      >
        <span className="min-w-0 truncate">{children}</span>
      </Button>
      <DropdownMenu
        open={menuOpen}
        onOpenChange={setMenuOpen}
        anchor={group}
        label={more}
        modal={modal}
        dir={direction}
        side={side}
        align={align}
        sideOffset={sideOffset}
        className={menuClass}
        content={renderContent?.({ close: closeMenu })}
      >
        <Button
          ref={trigger}
          data-hn-split-trigger=""
          type="button"
          iconOnly
          variant={variant}
          tone={tone}
          size={size}
          pill={pill}
          ripple={ripple}
          disabled={menuBlocked}
          aria-label={more}
        >
          <DisclosureIcon open={menuOpen} />
        </Button>
      </DropdownMenu>
    </ButtonGroup>
  )
}
