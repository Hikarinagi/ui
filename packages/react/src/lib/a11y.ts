'use client'

import { useEffect } from 'react'
import { devWarn } from './dev'

interface NamedAttributes {
  'aria-label'?: string
  'aria-labelledby'?: string
  title?: string
}

export function useAccessibleName(scope: string, required: boolean, attrs: NamedAttributes) {
  const named = !!(attrs['aria-label'] || attrs['aria-labelledby'] || attrs.title)
  useEffect(() => {
    if (!import.meta.env.DEV || !required || named) return
    devWarn(scope, '缺少可访问名称,请提供 aria-label 或 aria-labelledby。', 'accessible-name')
  }, [scope, required, named])
}

export function useRequiredLabel(scope: string, has: boolean, what: string) {
  useEffect(() => {
    if (!import.meta.env.DEV || has) return
    devWarn(scope, `缺少${what},屏幕阅读器无法识别该控件。`, `required-label:${what}`)
  }, [scope, has, what])
}
