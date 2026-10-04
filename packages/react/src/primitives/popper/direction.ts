'use client'

import { Direction as RadixDirection } from 'radix-ui'
import type { Direction } from './utils'

export function usePopperDirection(dir?: Direction | (string & {})): Direction {
  return RadixDirection.useDirection(dir as Direction | undefined)
}
