import { onMounted, shallowRef, watch } from 'vue'
import type { ThemedToken } from 'shiki/core'
import { devWarn } from '../../../lib/dev'
import { tokenize } from '../highlighter'

export function useCodeHighlight(props: { code: string; lang?: string; html?: string }) {
  const tokens = shallowRef<ThemedToken[][] | null>(null)

  onMounted(() => {
    watch(
      () => [props.code, props.lang, props.html] as const,
      async ([code, lang, html]) => {
        if (html || !lang) {
          tokens.value = null
          return
        }
        try {
          const result = await tokenize(code, lang)
          if (code === props.code && lang === props.lang) tokens.value = result
        } catch (error) {
          tokens.value = null
          devWarn('CodeBlock', `着色管线失败,已退回素文本(lang="${lang}"):${String(error)}`, lang)
        }
      },
      { immediate: true },
    )
  })

  return tokens
}
