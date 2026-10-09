'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Primitive, type PrimitiveElementProps } from '../../lib/primitive'
import { useLayoutEffect } from '../utils/layout-effect'

export interface PortalProps extends PrimitiveElementProps {
  container?: Element | DocumentFragment | null
}

export function Portal({ container, ...props }: PortalProps) {
  const [mounted, setMounted] = useState(false)
  useLayoutEffect(() => setMounted(true), [])
  const target = container || (mounted ? globalThis.document?.body : null)
  return target ? createPortal(<Primitive {...props} />, target) : null
}
