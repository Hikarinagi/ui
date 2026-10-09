'use client'

import type { HTMLAttributes, ReactNode, Ref } from 'react'
import { useUiLocale } from '../../locale'
import {
  useVirtualChoices,
  type VirtualChoiceKind,
  type VirtualComboboxBridge,
} from '../../lib/virtual/useVirtualChoices'
import type { VirtualizeOptions } from '../../lib/virtual/types'
import { ScrollArea } from '../scroll-area/ScrollArea'
import { selectEmpty, selectLabel } from '../select/select.variants'
import type { SelectItems, SelectOption } from '../select/types'
import { virtualListContent, virtualListItem } from './virtual-list.variants'
import { useComposedRefs } from '../../primitives/utils/compose-refs'

export interface VirtualChoiceAttrs {
  'aria-posinset': number
  'aria-setsize': number
  'aria-describedby': string | undefined
}

export interface VirtualChoicesProps<T extends SelectOption = SelectOption> extends Omit<
  HTMLAttributes<HTMLElement>,
  'children'
> {
  options: SelectItems<T>
  kind: VirtualChoiceKind
  virtualize?: VirtualizeOptions
  input?: HTMLElement | null
  combobox?: VirtualComboboxBridge
  padded?: boolean
  maxHeight?: string | number
  children: (props: { option: T; attrs: VirtualChoiceAttrs }) => ReactNode
  empty?: ReactNode
  ref?: Ref<HTMLElement>
  [attribute: `data-${string}`]: string | undefined
}

export function VirtualChoices<T extends SelectOption = SelectOption>({
  options,
  kind,
  virtualize,
  input,
  combobox,
  padded,
  maxHeight,
  children,
  empty,
  className,
  style,
  ref,
  ...attrs
}: VirtualChoicesProps<T>) {
  const t = useUiLocale()
  const { area, body, rows, entries, bodyStyle, measure, itemAttrs, labelId } =
    useVirtualChoices<T>({ options, kind, virtualize, input, combobox })
  const composedRef = useComposedRefs(ref, body)

  return (
    <ScrollArea
      ref={area}
      className={className}
      style={{ maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight }}
    >
      <div className={padded ? 'p-1' : undefined}>
        <div
          {...attrs}
          ref={composedRef as Ref<HTMLDivElement>}
          data-hn-virtual-choices=""
          className={virtualListContent({ orientation: 'vertical' })}
          style={{ ...style, ...bodyStyle }}
        >
          {entries.map(entry => {
            const row = rows[entry.index]!
            return (
              <div
                key={entry.key}
                ref={element => measure(element)}
                data-index={entry.index}
                role="presentation"
                className={virtualListItem({ orientation: 'vertical' })}
                style={{ marginBlockStart: `${entry.gapBefore}px` }}
              >
                {row.option ? (
                  children({ option: row.option, attrs: itemAttrs(entry.index) })
                ) : (
                  <div id={labelId(entry.index)} className={selectLabel()}>
                    {row.label}
                  </div>
                )}
              </div>
            )
          })}
        </div>
        {!rows.length && <div className={selectEmpty()}>{empty ?? t.select.empty}</div>}
      </div>
    </ScrollArea>
  )
}
