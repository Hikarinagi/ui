'use client'

import type { Direction } from '../../../../shared/src/primitives/popper'
import { useDirection } from '../utils/direction'

export function usePopperDirection(dir?: Direction | (string & {})): Direction {
  return useDirection(dir as Direction | undefined)
}
