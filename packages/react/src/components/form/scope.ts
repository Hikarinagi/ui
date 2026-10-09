'use client'

import { createContext, useContext, useMemo, useRef, useState } from 'react'
import { useLayoutEffect } from '../../primitives/utils/layout-effect'

interface FormScopeValue {
  set: (id: symbol, submitting: boolean) => void
}

export const FormScopeContext = createContext<FormScopeValue | null>(null)

export function useFormScope() {
  const active = useRef(new Set<symbol>())
  const [submitting, setSubmitting] = useState(false)
  const scope = useMemo<FormScopeValue>(
    () => ({
      set(id, value) {
        if (value) active.current.add(id)
        else active.current.delete(id)
        setSubmitting(active.current.size > 0)
      },
    }),
    [],
  )
  return { submitting, scope }
}

export function useFormScopeReport(submitting: boolean) {
  const scope = useContext(FormScopeContext)
  const [id] = useState(() => Symbol('form'))
  useLayoutEffect(() => {
    if (!scope) return
    scope.set(id, submitting)
    return () => scope.set(id, false)
  }, [scope, id, submitting])
}
