'use client'

import { useState } from 'react'
import { Autocomplete, FormField, Stack, Text } from '@hina-ui/react'

const candidates = ['Vue', 'React', 'Svelte', 'Solid', 'Angular']

export default function Demo() {
  const [text, setText] = useState('')
  const options = candidates
    .filter(label => label.toLowerCase().includes(text.toLowerCase()))
    .map(label => ({ value: label, label }))

  return (
    <Stack className="w-full max-w-sm">
      <FormField label="框架" description="选择建议，也可以保留自己输入的文字。">
        <Autocomplete
          value={text}
          onValueChange={setText}
          options={options}
          placeholder="输入框架名称"
        />
      </FormField>
      <Text tone="muted" size="sm">
        文本：{text || '—'}
      </Text>
    </Stack>
  )
}
