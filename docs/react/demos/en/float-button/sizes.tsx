'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { FloatButton, Flex, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  const [result, setResult] = useState(
    'Extended buttons keep the same height and grow to fit the label',
  )

  return (
    <Stack align="center" gap="lg">
      <Flex wrap align="center" justify="center" gap="lg">
        {(['sm', 'md', 'lg'] as const).map(size => (
          <FloatButton
            key={size}
            position="static"
            size={size}
            label={`Create project（${size}）`}
            onClick={() => setResult(`Selected: ${size}`)}
          >
            <Plus />
          </FloatButton>
        ))}
        <FloatButton
          position="static"
          extended
          label="Create project"
          onClick={() => setResult('Selected: Create project')}
        >
          <Plus />
        </FloatButton>
      </Flex>
      <Text role="status" size="sm" tone="muted">
        {result}
      </Text>
    </Stack>
  )
}
