'use client'

import { useEffect, useRef, useState } from 'react'
import type { ThemedToken } from 'shiki/core'
import { devWarn } from '../../../lib/dev'
import { tokenize } from '../highlighter'

export function useCodeHighlight(props: { code: string; lang?: string; html?: string }) {
  const [tokens, setTokens] = useState<ThemedToken[][] | null>(null)
  const latest = useRef(props)
  latest.current = props
  const { code, lang, html } = props

  useEffect(() => {
    if (html || !lang) {
      setTokens(null)
      return
    }
    tokenize(code, lang).then(
      result => {
        if (code === latest.current.code && lang === latest.current.lang) setTokens(result)
      },
      error => {
        setTokens(null)
        devWarn('CodeBlock', `着色管线失败,已退回素文本(lang="${lang}"):${String(error)}`, lang)
      },
    )
  }, [code, lang, html])

  return tokens
}
