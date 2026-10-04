'use client'

import { useState } from 'react'
import { Button, Spoiler, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  const [hidden, setHidden] = useState(true)

  return (
    <Stack className="max-w-lg">
      <Text>
        全书结局：{' '}
        <Spoiler hidden={hidden} onHiddenChange={setHidden}>
          交易在最后一刻反转
        </Spoiler>
      </Text>
      <Button variant="outline" tone="neutral" size="sm" onClick={() => setHidden(!hidden)}>
        {hidden ? '全部揭示' : '全部遮住'}
      </Button>
    </Stack>
  )
}
