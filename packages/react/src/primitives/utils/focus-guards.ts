'use client'

import { useEffect } from 'react'
import { installFocusGuards } from '../../../../shared/src/primitives/focus-guards'

export function useFocusGuards() {
  useEffect(() => installFocusGuards(), [])
}
