import { useAttrs, watchEffect } from 'vue'
import { devWarn } from './dev'

export function useAccessibleName(scope: string, required: () => boolean) {
  if (!import.meta.env.DEV) return
  const attrs = useAttrs()
  watchEffect(() => {
    if (!required()) return
    if (attrs['aria-label'] || attrs['aria-labelledby'] || attrs.title) return
    devWarn(scope, '缺少可访问名称,请提供 aria-label 或 aria-labelledby。', 'accessible-name')
  })
}

export function useRequiredLabel(scope: string, has: () => boolean, what: string) {
  if (!import.meta.env.DEV) return
  watchEffect(() => {
    if (has()) return
    devWarn(scope, `缺少${what},屏幕阅读器无法识别该控件。`, `required-label:${what}`)
  })
}
