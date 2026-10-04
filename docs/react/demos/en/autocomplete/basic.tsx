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
      <FormField label="Framework" description="Choose a suggestion or keep your own text.">
        <Autocomplete
          value={text}
          onValueChange={setText}
          options={options}
          placeholder="Type a framework name"
        />
      </FormField>
      <Text tone="muted" size="sm">
        Text: {text || '—'}
      </Text>
    </Stack>
  )
}
