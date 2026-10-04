'use client'

import { useRef, useState, useSyncExternalStore } from 'react'
import { createForm, type FormValidateOn } from '../../../../../shared/src/behavior/form'
import type { FormRules, FormValues } from '../standard-schema'

export type { FormValidateOn } from '../../../../../shared/src/behavior/form'

interface Options {
  values: FormValues
  rules: FormRules | undefined
  validateOn: FormValidateOn
}

export function useForm(options: Options) {
  const latest = useRef(options)
  latest.current = options
  const [form] = useState(() =>
    createForm({
      values: () => latest.current.values,
      rules: () => latest.current.rules,
      validateOn: () => latest.current.validateOn,
    }),
  )
  useSyncExternalStore(form.subscribe, form.version, form.version)
  return form
}
