'use client'

import type { PrimitiveElementProps } from '../../lib/primitive'
import { DismissableLayerBranch } from '../../primitives/dismissable-layer'

export type OverlayBranchProps = PrimitiveElementProps

export function OverlayBranch({ as = 'div', ...props }: OverlayBranchProps) {
  return <DismissableLayerBranch as={as} {...props} />
}
