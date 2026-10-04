'use client'

import { useState } from 'react'
import { Button, Inline, Input, Stack, Switch, Text, Tooltip } from '@hina-ui/react'

export default function Demo() {
  const [content, setContent] = useState('Tooltip text')
  const [disabled, setDisabled] = useState(false)
  return (
    <Stack align="start">
      <Inline>
        <Tooltip content="Bound to the existing element">
          <Button variant="outline" tone="neutral">
            String
          </Button>
        </Tooltip>
        <Tooltip content={content} side="bottom" disabled={disabled}>
          <Button variant="outline" tone="neutral">
            Options
          </Button>
        </Tooltip>
      </Inline>
      <Input
        value={content}
        onValueChange={setContent}
        aria-label="Tooltip text"
        className="w-64"
      />
      <Inline>
        <Switch
          checked={disabled}
          onCheckedChange={setDisabled}
          aria-label="Disable configured tooltip"
        />
        <Text>Disable configured tooltip</Text>
      </Inline>
    </Stack>
  )
}
