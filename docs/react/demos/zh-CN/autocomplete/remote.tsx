'use client'

import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import {
  Autocomplete,
  FormField,
  Stack,
  Text,
  type AutocompleteOption,
  type CompletionContext,
} from '@hina-ui/react'

interface TagPage {
  data: { items: { id: number; name: string; nameEn: string }[] }
}

export default function Demo() {
  const [text, setText] = useState('')
  const [search, setSearch] = useState('')
  const [keyword, setKeyword] = useState('')
  const [options, setOptions] = useState<AutocompleteOption[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setKeyword(search), 250)
    return () => clearTimeout(timer)
  }, [search])

  function query(context: CompletionContext) {
    if (search === context.text) return
    setSearch(context.text)
    setOptions([])
    setLoading(!!context.text.trim())
    setError(false)
  }

  useEffect(() => {
    const controller = new AbortController()
    if (!keyword.trim()) {
      setOptions([])
      setLoading(false)
      return () => controller.abort()
    }
    setLoading(true)
    setError(false)
    fetch('/demo/tags.json', { signal: controller.signal })
      .then(async response => {
        if (!response.ok) throw new Error(String(response.status))
        const result = (await response.json()) as TagPage
        if (controller.signal.aborted) return
        setOptions(
          result.data.items
            .filter(tag => tag.name.toLowerCase().includes(keyword.trim().toLowerCase()))
            .slice(0, 10)
            .map(tag => ({ value: tag.id, label: tag.name })),
        )
      })
      .catch(() => {
        if (!controller.signal.aborted) setError(true)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [keyword])

  return (
    <Stack className="w-full max-w-sm">
      <FormField label="标签搜索" description="输入时请求候选，也允许保留候选之外的文本。">
        <Autocomplete
          value={text}
          onValueChange={setText}
          options={options}
          loading={loading}
          placeholder="试试「小说」或「音乐」"
          onQuery={query}
          leading={<Search />}
          empty={
            error
              ? '候选加载失败，修改文字后重试。'
              : text.trim()
                ? '没有建议，仍可使用当前文本。'
                : '输入文字搜索标签。'
          }
        />
      </FormField>
      <Text tone="muted" size="sm">
        文本：{text || '—'}
      </Text>
    </Stack>
  )
}
