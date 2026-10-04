'use client'

import {
  createContext,
  use,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
  type RefObject,
} from 'react'
import { COLLECTION_ITEM } from '../../../../shared/src/primitives/collection'
import { useComposedRefs } from '../utils/compose-refs'
import { Slot } from '../utils/slot'

export function createCollection<E extends HTMLElement, ItemData = object>(name: string) {
  type Item = { ref: RefObject<E | null> } & ItemData
  interface Context {
    root: RefObject<E | null>
    items: Map<RefObject<E | null>, Item>
  }
  const CollectionContext = createContext<Context | null>(null)

  function useContext() {
    const context = use(CollectionContext)
    if (!context)
      throw new Error(`${name}Collection must be used within ${name}Collection.Provider`)
    return context
  }

  function Provider({ children }: { children?: ReactNode }) {
    const root = useRef<E | null>(null)
    const items = useRef(new Map<RefObject<E | null>, Item>())
    return <CollectionContext value={{ root, items: items.current }}>{children}</CollectionContext>
  }

  function CollectionSlot({ children }: { children?: ReactNode }) {
    const context = useContext()
    const ref = useComposedRefs<E>(context.root)
    return <Slot ref={ref as never}>{children}</Slot>
  }

  function ItemSlot({ children, ...data }: { children?: ReactNode } & ItemData) {
    const context = useContext()
    const ref = useRef<E | null>(null)
    const composed = useComposedRefs<E>(ref)
    useEffect(() => {
      context.items.set(ref, { ref, ...(data as ItemData) } as Item)
      return () => {
        context.items.delete(ref)
      }
    })
    return (
      <Slot {...{ [COLLECTION_ITEM]: '' }} ref={composed as never}>
        {children}
      </Slot>
    )
  }

  function useCollection() {
    const context = useContext()
    return useCallback(() => {
      const root = context.root.current
      if (!root) return []
      const nodes = Array.from(root.querySelectorAll(`[${COLLECTION_ITEM}]`))
      return Array.from(context.items.values()).sort(
        (a, b) => nodes.indexOf(a.ref.current!) - nodes.indexOf(b.ref.current!),
      )
    }, [context])
  }

  return [{ Provider, Slot: CollectionSlot, ItemSlot }, useCollection] as const
}
