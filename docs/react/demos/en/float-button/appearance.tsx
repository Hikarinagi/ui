'use client'

import { useState } from 'react'
import { HelpCircle, Pencil, Plus } from 'lucide-react'
import { FloatButton, Flex, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  const [result, setResult] = useState('Hover or focus with the keyboard to see each action name')

  return (
    <Stack align="center" gap="lg">
      <Flex wrap justify="center" gap="lg">
        <FloatButton
          position="static"
          label="Create project"
          onClick={() => setResult('Selected: Create project')}
        >
          <Plus />
        </FloatButton>
        <FloatButton
          position="static"
          label="Edit project"
          variant="soft"
          shape="square"
          onClick={() => setResult('Selected: Edit project')}
        >
          <Pencil />
        </FloatButton>
        <FloatButton
          position="static"
          label="Help center"
          variant="outline"
          tone="neutral"
          onClick={() => setResult('Selected: Help center')}
        >
          <HelpCircle />
        </FloatButton>
      </Flex>
      <Text role="status" size="sm" tone="muted">
        {result}
      </Text>
    </Stack>
  )
}
