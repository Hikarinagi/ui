import { cn } from '../../lib/cn'
import {
  SplitterPanel as PrimitiveSplitterPanel,
  type SplitterPanelProps as PrimitiveSplitterPanelProps,
} from '../../primitives/splitter'

export interface SplitterPanelProps extends PrimitiveSplitterPanelProps {
  defaultSize?: number
  minSize?: number
  maxSize?: number
  collapsible?: boolean
  collapsedSize?: number
}

export function SplitterPanel({
  defaultSize,
  minSize,
  maxSize,
  collapsible = false,
  collapsedSize,
  className,
  ...attrs
}: SplitterPanelProps) {
  return (
    <PrimitiveSplitterPanel
      {...attrs}
      defaultSize={defaultSize}
      minSize={minSize}
      maxSize={maxSize}
      collapsible={collapsible}
      collapsedSize={collapsedSize}
      className={cn('min-h-0 min-w-0', className)}
    />
  )
}
