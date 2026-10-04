'use client'

import {
  cloneElement,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
} from 'react'
import { useVirtualizer, type VirtualItem, type Virtualizer } from '@tanstack/react-virtual'
import { getActiveElement } from '../roving-focus/utils'
import { useListboxRootContext } from './index'
import { compare, findValuesBetween, getNextMatch } from './utils'

const FOCUS_INTENT: Record<string, 'first' | 'last' | 'prev' | 'next'> = {
  ArrowLeft: 'prev',
  ArrowUp: 'prev',
  ArrowRight: 'next',
  ArrowDown: 'next',
  PageUp: 'first',
  Home: 'first',
  PageDown: 'last',
  End: 'last',
}

export interface ListboxVirtualizerSlotProps<T> {
  option: T
  virtualizer: Virtualizer<HTMLElement, Element>
  virtualItem: VirtualItem
}

export interface ListboxVirtualizerProps<T> {
  options: T[]
  overscan?: number
  estimateSize?: number | ((index: number) => number)
  textContent?: (option: T) => string
  children: (props: ListboxVirtualizerSlotProps<T>) => ReactElement
}

function queryCheckedElement(parent: HTMLElement | null) {
  return parent?.querySelector<HTMLElement>('[data-state=checked]') ?? null
}

export function ListboxVirtualizer<T>({
  options,
  overscan,
  estimateSize,
  textContent,
  children,
}: ListboxVirtualizerProps<T>) {
  const root = useListboxRootContext('ListboxVirtualizer')
  const element = useRef<HTMLDivElement | null>(null)
  const [parent, setParent] = useState<HTMLElement | null>(null)
  const search = useRef({
    value: '',
    timer: undefined as ReturnType<typeof setTimeout> | undefined,
  })
  root.isVirtual.current = true

  useLayoutEffect(() => {
    setParent(element.current?.parentElement ?? null)
  }, [])

  const styles = parent ? window.getComputedStyle(parent) : null
  const padding = {
    start: styles ? Number.parseFloat(styles.paddingBlockStart || styles.paddingTop) : 0,
    end: styles ? Number.parseFloat(styles.paddingBlockEnd || styles.paddingBottom) : 0,
  }

  const virtualizer = useVirtualizer<HTMLElement, Element>({
    scrollPaddingStart: padding.start,
    scrollPaddingEnd: padding.end,
    count: options.length,
    horizontal: root.orientation === 'horizontal',
    estimateSize: index =>
      typeof estimateSize === 'function' ? estimateSize(index) : (estimateSize ?? 28),
    getScrollElement: () => parent,
    overscan: overscan ?? 12,
  })

  const latest = useRef({ options, textContent, root, parent, virtualizer })
  latest.current = { options, textContent, root, parent, virtualizer }

  useEffect(() => {
    const items = () =>
      latest.current.root.getItems().filter(item => item.ref.dataset.disabled !== '')
    const focus = root.virtualFocusHook.on(({ event, scroll }) => {
      const { options, root, parent, virtualizer } = latest.current
      const model = root.getModelValue()
      const index = options.findIndex(option =>
        Array.isArray(model) ? compare(option, model[0], root.by) : compare(option, model, root.by),
      )
      if (index !== -1) {
        event?.preventDefault()
        virtualizer.scrollToIndex(index, { align: 'start' })
        requestAnimationFrame(() => {
          const item = queryCheckedElement(parent)
          if (item) {
            const focus = event ? true : scroll ? undefined : false
            root.changeHighlight(item, scroll, focus)
          }
        })
      } else if (scroll) root.highlightFirstItem()
      else
        requestAnimationFrame(() => {
          const item = latest.current.root
            .getItems()
            .find(entry => entry.ref.dataset.disabled !== '')?.ref
          if (item) latest.current.root.changeHighlight(item, false, false)
        })
    })
    const highlight = root.virtualHighlightHook.on(value => {
      const { options, root, parent, virtualizer } = latest.current
      const index = options.findIndex(option => compare(option, value, root.by))
      virtualizer.scrollToIndex(index, { align: 'start' })
      requestAnimationFrame(() => {
        const item = queryCheckedElement(parent)
        if (item) root.changeHighlight(item)
      })
    })
    const keydown = root.virtualKeydownHook.on(event => {
      const { options, textContent, root, parent, virtualizer } = latest.current
      const isMetaKey = event.altKey || event.ctrlKey || event.metaKey
      if (event.key === 'Tab' && !isMetaKey) return
      let intent = FOCUS_INTENT[event.key]
      if (isMetaKey && event.key === 'a' && root.multiple) {
        event.preventDefault()
        root.setModelValue([...options])
        intent = 'last'
      } else if (event.shiftKey && intent) {
        const model = root.getModelValue()
        const first = root.firstValue.current
        if (first && root.multiple && Array.isArray(model)) {
          const last = items().find(item => item.ref === root.getHighlightedElement())?.value
          if (last) {
            const value =
              intent === 'first'
                ? findValuesBetween(options, first as T, options[0]!)
                : intent === 'last'
                  ? findValuesBetween(options, first as T, options.at(-1)!)
                  : findValuesBetween(options, first as T, last as T)
            root.setModelValue(value)
          }
        }
      }
      if (intent === 'first' || intent === 'last') {
        event.preventDefault()
        virtualizer.scrollToIndex(intent === 'first' ? 0 : options.length - 1)
        requestAnimationFrame(() => {
          const entries = latest.current.root.getItems()
          const item = intent === 'first' ? entries[0] : entries.at(-1)
          if (item) latest.current.root.changeHighlight(item.ref)
        })
      } else if (!intent && !isMetaKey) {
        const state = search.current
        state.value += event.key
        clearTimeout(state.timer)
        state.timer = setTimeout(() => {
          state.value = ''
        }, 1000)
        const texts = options.map(option =>
          textContent ? textContent(option) : String(option).toLowerCase(),
        )
        const currentIndex = Number(getActiveElement()?.getAttribute('data-index'))
        const next = getNextMatch(texts, state.value, texts[currentIndex])
        const index = texts.findIndex(text => text === next)
        if (next !== undefined && index >= 0) {
          virtualizer.scrollToIndex(index, { align: 'start' })
          requestAnimationFrame(() => {
            const item = parent?.querySelector(`[data-index="${index}"]`)
            if (item instanceof HTMLElement) latest.current.root.changeHighlight(item)
          })
        }
      }
    })
    return () => {
      focus.off()
      highlight.off()
      keydown.off()
      clearTimeout(search.current.timer)
    }
  }, [root.virtualFocusHook, root.virtualHighlightHook, root.virtualKeydownHook])

  return (
    <div
      ref={element}
      data-radix-virtualizer=""
      style={{ position: 'relative', width: '100%', height: `${virtualizer.getTotalSize()}px` }}
    >
      {virtualizer.getVirtualItems().map(item => {
        const node = children({ option: options[item.index]!, virtualizer, virtualItem: item })
        const style: CSSProperties = {
          position: 'absolute',
          top: 0,
          left: 0,
          transform: `translateY(${item.start}px)`,
          overflowAnchor: 'none',
        }
        return cloneElement(node as ReactElement<Record<string, unknown>>, {
          key: item.index,
          'data-index': item.index,
          'aria-setsize': options.length,
          'aria-posinset': item.index + 1,
          style,
        })
      })}
    </div>
  )
}
