'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Card, Center, FloatButton, FormField, Stack, Switch, Text } from '@hina-ui/react'

const placements = ['top-start', 'top-end', 'bottom-start', 'bottom-end'] as const

export default function Demo() {
  const [rtl, setRtl] = useState(false)
  const [result, setResult] = useState('start / end 随书写方向切换')

  return (
    <Stack className="w-full max-w-md">
      <FormField label="从右向左" orientation="horizontal">
        <Switch checked={rtl} onCheckedChange={setRtl} />
      </FormField>
      <Card dir={rtl ? 'rtl' : 'ltr'} className="relative h-64" padded={false}>
        <Center className="h-full px-16">
          <Text role="status" size="sm" tone="muted" className="text-center">
            {result}
          </Text>
        </Center>
        {placements.map(placement => (
          <FloatButton
            key={placement}
            position="absolute"
            placement={placement}
            label={placement}
            offset={16}
            variant="soft"
            size="sm"
            onClick={() => setResult(placement)}
          >
            <Plus />
          </FloatButton>
        ))}
      </Card>
    </Stack>
  )
}
