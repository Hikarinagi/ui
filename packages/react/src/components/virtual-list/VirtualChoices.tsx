'use client'

import type { HTMLAttributes, ReactNode, Ref } from 'react'
import { cn } from '../../lib/cn'
import { useUiLocale } from '../../locale'
import {
  useVirtualChoices,
  type VirtualChoiceKind,
  type VirtualComboboxBridge,
} from '../../lib/virtual/useVirtualChoices'
import type { VirtualizeOptions } from '../../lib/virtual/types'
import { ScrollArea } from '../scroll-area/ScrollArea'
import { selectEmpty, selectLabel } from '../select/select.variants'
import type { SelectItems, SelectOption, SelectOptionGroup } from '../select/types'
import {
  virtualChoiceHeading,
  virtualChoiceHeadings,
  virtualListContent,
  virtualListItem,
} from './virtual-list.variants'
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
  renderGroup?: (props: { group: SelectOptionGroup<T> }) => ReactNode
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
  renderGroup,
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
  const origin = entries[0] ? entries[0].start - parseFloat(bodyStyle.paddingBlockStart) : 0

  return (
    <ScrollArea
      ref={area}
      className={className}
      style={{ maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight }}
    >
      <div className={cn(renderGroup && 'relative', padded && 'p-1') || undefined}>
        <div
          {...attrs}
          ref={composedRef as Ref<HTMLDivElement>}
          data-hn-virtual-choices=""
          className={virtualListContent({ orientation: 'vertical' })}
          style={{ ...style, ...bodyStyle }}
        >
          {entries.map(entry => {
            const row = rows[entry.index]!
            if (renderGroup && !row.option)
              return (
                <div
                  key={entry.key}
                  data-index={entry.index}
                  role="presentation"
                  className={virtualListItem({ orientation: 'vertical' })}
                  style={{ marginBlockStart: `${entry.gapBefore}px`, height: `${entry.size}px` }}
                >
                  <span id={labelId(entry.index)} hidden>
                    {row.label}
                  </span>
                </div>
              )
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
        {!rows.length ? (
          <div className={selectEmpty()}>{empty ?? t.select.empty}</div>
        ) : (
          renderGroup && (
            <div className={virtualChoiceHeadings()}>
              <div className="relative">
                {entries.map(entry => {
                  const group = rows[entry.index]!.source
                  return (
                    group && (
                      <div
                        key={entry.key}
                        ref={element => measure(element)}
                        data-index={entry.index}
                        className={virtualChoiceHeading()}
                        style={{ top: `${entry.start - origin}px` }}
                      >
                        {renderGroup({ group })}
                      </div>
                    )
                  )
                })}
              </div>
            </div>
          )
        )}
      </div>
    </ScrollArea>
  )
}
