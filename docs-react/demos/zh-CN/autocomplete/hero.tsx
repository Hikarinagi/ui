'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import {
  Autocomplete,
  Kbd,
  Stack,
  Tag,
  Text,
  type AutocompleteOption,
  type CompletionContext,
  type CompletionEdit,
} from '@hina-ui/react'

const queryValues: Record<string, string[]> = {
  entry: ['http', 'rpc', 'job', 'consumer'],
  status: ['ok', 'error', 'timeout'],
  duration: ['>500ms', '>1s', '>5s'],
  service: ['gateway', 'catalog', 'checkout', 'worker'],
}

function queryToken(context: CompletionContext) {
  const { text, selectionStart, selectionEnd } = context
  const start = selectionStart > 0 ? text.lastIndexOf(' ', selectionStart - 1) + 1 : 0
  const nextSpace = text.indexOf(' ', selectionEnd)
  const end = nextSpace < 0 ? text.length : nextSpace
  const colon = text.indexOf(':', start)
  const hasKey = colon >= start && colon < selectionStart
  const rangeStart = hasKey ? colon + 1 : start
  return {
    key: hasKey ? text.slice(start, colon) : '',
    prefix: text.slice(rangeStart, selectionStart).toLowerCase(),
    range: [rangeStart, !hasKey && colon >= start && colon < end ? colon + 1 : end] as [
      number,
      number,
    ],
  }
}

const descriptions: Record<string, string> = {
  entry: '入口类型',
  status: '请求状态',
  duration: '请求耗时',
  service: '服务名称',
}

function complete(option: AutocompleteOption, context: CompletionContext): CompletionEdit {
  const token = queryToken(context)
  return { range: token.range, text: option.label, keepOpen: !token.key }
}

export default function Demo() {
  const [text, setText] = useState('entry:http ')
  const [applied, setApplied] = useState('entry:http ')
  const [options, setOptions] = useState<AutocompleteOption[]>([])

  function query(context: CompletionContext) {
    const token = queryToken(context)
    const values = token.key ? (queryValues[token.key] ?? []) : Object.keys(queryValues)
    setOptions(
      values
        .filter(value => value.startsWith(token.prefix))
        .map(value => ({
          value,
          label: token.key ? value : `${value}:`,
          description: token.key ? undefined : descriptions[value],
        })),
    )
  }

  return (
    <Stack className="w-full max-w-lg">
      <Autocomplete
        value={text}
        onValueChange={setText}
        options={options}
        getCompletion={complete}
        selectOnTab
        aria-label="请求查询"
        placeholder="entry:http status:error duration:>500ms"
        onQuery={query}
        onSubmit={setApplied}
        leading={<Search />}
        trailing={
          text !== applied ? (
            <Tag size="sm" tone="warning" className="mx-2 whitespace-nowrap">
              待应用
            </Tag>
          ) : (
            <Kbd className="mx-2">Enter</Kbd>
          )
        }
      />
      <Text tone="muted" size="sm">
        输入 sta，选择 status: 后继续选择 error。没有高亮候选时，回车应用整条查询。
      </Text>
      <Text size="sm" className="break-all">
        已应用：{applied || '—'}
      </Text>
    </Stack>
  )
}
