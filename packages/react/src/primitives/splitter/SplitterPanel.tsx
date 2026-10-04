'use client'

import { useEffect, useId, useLayoutEffect, useMemo, useRef } from 'react'
import type { CSSProperties, HTMLAttributes, ReactNode, Ref } from 'react'
import { Primitive, type PrimitiveProps } from '../../lib/primitive'
import { usePanelGroupContext } from './context'
import { PRECISION } from './utils/constants'
import type { PanelConstraints, PanelData, SizeUnit } from './utils/types'

export interface SplitterPanelProps
  extends PrimitiveProps, Omit<HTMLAttributes<HTMLElement>, 'onResize'> {
  collapsedSize?: number
  collapsible?: boolean
  defaultSize?: number
  id?: string
  maxSize?: number
  minSize?: number
  order?: number
  sizeUnit?: SizeUnit
  onCollapse?: () => void
  onExpand?: () => void
  onResize?: (size: number, prevSize: number | undefined) => void
  children?: ReactNode
  ref?: Ref<HTMLElement>
}

export function SplitterPanel({
  collapsedSize,
  collapsible = false,
  defaultSize,
  id,
  maxSize,
  minSize,
  order,
  sizeUnit,
  onCollapse,
  onExpand,
  onResize,
  as,
  asChild,
  style,
  children,
  ...attrs
}: SplitterPanelProps) {
  const { api, groupId } = usePanelGroupContext('SplitterPanel')
  const generatedId = useId()
  const panelId = id || `reka-splitter-panel-${generatedId}`
  const callbacks = useRef({ onCollapse, onExpand, onResize })
  callbacks.current = { onCollapse, onExpand, onResize }
  const constraints = useMemo<PanelConstraints>(
    () => ({
      collapsedSize: collapsedSize && Number.parseFloat(collapsedSize.toFixed(PRECISION)),
      collapsible,
      defaultSize,
      maxSize,
      minSize,
      sizeUnit: sizeUnit ?? '%',
    }),
    [collapsedSize, collapsible, defaultSize, maxSize, minSize, sizeUnit],
  )
  const panelData = useMemo<PanelData>(
    () => ({
      callbacks: {
        onCollapse: () => callbacks.current.onCollapse?.(),
        onExpand: () => callbacks.current.onExpand?.(),
        onResize: (size, prevSize) => callbacks.current.onResize?.(size, prevSize),
      },
      constraints,
      id: panelId,
      idIsFromProps: id !== undefined,
      order,
    }),
    [constraints, panelId, id, order],
  )
  const current = useRef(panelData)
  current.current = panelData

  const previous = useRef(constraints)
  useEffect(() => {
    const prevConstraints = previous.current
    previous.current = constraints
    if (prevConstraints === constraints) return
    if (
      prevConstraints.collapsedSize !== constraints.collapsedSize ||
      prevConstraints.collapsible !== constraints.collapsible ||
      prevConstraints.maxSize !== constraints.maxSize ||
      prevConstraints.minSize !== constraints.minSize ||
      prevConstraints.sizeUnit !== constraints.sizeUnit
    )
      api.reevaluatePanelConstraints(current.current, prevConstraints)
  }, [api, constraints])

  useLayoutEffect(() => {
    api.registerPanel(current.current)
    return () => api.unregisterPanel(current.current)
  }, [api])

  const panelStyle = api.getPanelStyle(panelData, defaultSize)
  const isCollapsed = api.isPanelCollapsed(panelData)

  return (
    <Primitive
      id={panelId}
      as={as}
      asChild={asChild}
      data-panel=""
      data-panel-collapsible={collapsible || undefined}
      data-panel-group-id={groupId}
      data-panel-id={panelId}
      data-panel-size={Number.parseFloat(`${panelStyle.flexGrow}`).toFixed(1)}
      data-state={collapsible ? (isCollapsed ? 'collapsed' : 'expanded') : undefined}
      {...attrs}
      style={{ ...panelStyle, ...style } as CSSProperties}
    >
      {children}
    </Primitive>
  )
}
