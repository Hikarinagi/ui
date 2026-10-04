import type { VNode } from 'vue'
import type { ReactElement } from 'react'

export interface ParityCase {
  name: string
  vue: () => VNode
  react: () => ReactElement
  ignoreAttributes?: string[]
  reason?: string
}

export interface ParitySuite {
  component: string
  cases: ParityCase[]
}

export function defineCases(component: string, cases: ParityCase[]): ParitySuite {
  for (const entry of cases)
    if (entry.ignoreAttributes?.length && !entry.reason)
      throw new Error(`${component} / ${entry.name}: ignored attributes need a reason`)
  return { component, cases }
}
