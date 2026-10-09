'use client'

import { useLayoutEffect as useReactLayoutEffect } from 'react'

export const useLayoutEffect: typeof useReactLayoutEffect = globalThis.document
  ? useReactLayoutEffect
  : () => {}
