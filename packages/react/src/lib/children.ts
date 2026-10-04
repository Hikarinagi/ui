'use client'

import { use, type ReactNode } from 'react'

const LAZY = Symbol.for('react.lazy')

interface LazyElement {
  $$typeof: symbol
  _payload: PromiseLike<ReactNode>
}

function isLazy(node: unknown): node is LazyElement {
  return typeof node === 'object' && node !== null && (node as LazyElement).$$typeof === LAZY
}

export function resolveChild<T extends ReactNode>(node: T): T {
  return isLazy(node) ? (use(node._payload) as T) : node
}
