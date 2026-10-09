'use client'

import type { ReactNode, Ref } from 'react'
import { ListboxItem } from '../../primitives/listbox'
import { Kbd } from '../kbd/Kbd'
import { selectItem } from '../select/select.variants'
import { commandItemBody, commandItemHint, commandItemMatch } from './command-palette.variants'
import type { CommandMatch } from './utils/match'

export interface CommandPaletteItemProps<T = unknown> {
  match: CommandMatch<T>
  render?: () => ReactNode
  onSelect?: () => void
  ref?: Ref<HTMLElement>
  [attribute: `aria-${string}`]: string | number | boolean | undefined
}

export function CommandPaletteItem<T = unknown>({
  match,
  render,
  onSelect,
  ...attrs
}: CommandPaletteItemProps<T>) {
  const { item, start, end } = match
  const parts =
    start < 0
      ? [item.label, '', '']
      : [item.label.slice(0, start), item.label.slice(start, end), item.label.slice(end)]
  const Icon = item.icon

  return (
    <ListboxItem
      {...attrs}
      value={item.id}
      disabled={item.disabled}
      data-hn-highlight-only=""
      className={selectItem()}
      onSelect={() => onSelect?.()}
    >
      {render ? (
        render()
      ) : (
        <>
          {Icon && <Icon aria-hidden="true" className="text-muted" />}
          <span className={commandItemBody()}>
            <span className="truncate">
              <span>{parts[0]}</span>
              {parts[1] && <span className={commandItemMatch()}>{parts[1]}</span>}
              {parts[2] && <span>{parts[2]}</span>}
            </span>
            {item.description && (
              <span className="text-muted truncate text-xs">{item.description}</span>
            )}
          </span>
          {!!item.kbd?.length && (
            <span className={commandItemHint()}>
              {item.kbd.map(key => (
                <Kbd key={key}>{key}</Kbd>
              ))}
            </span>
          )}
        </>
      )}
    </ListboxItem>
  )
}
