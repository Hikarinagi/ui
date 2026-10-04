'use client'

import { useState } from 'react'
import { Button, Grid, Highlight, Inline, Stack, Text } from '@hina-ui/react'

const rows = ['简介', '角色', '制作人员', '发售信息']

export default function Demo() {
  const [from, setFrom] = useState(1)
  const [to, setTo] = useState(2)
  const span = `${Math.min(from, to) + 1} / ${Math.max(from, to) + 2}`

  return (
    <Stack gap="md" className="w-full max-w-sm">
      <Inline gap="sm">
        <Button
          size="sm"
          variant="outline"
          tone="neutral"
          onClick={() => setFrom((from + 1) % rows.length)}
        >
          移动起点
        </Button>
        <Button
          size="sm"
          variant="outline"
          tone="neutral"
          onClick={() => setTo((to + 1) % rows.length)}
        >
          移动终点
        </Button>
      </Inline>

      <Grid cols={1} gap="none" className="border-line relative isolate rounded-lg border p-1">
        <Highlight
          axis="y"
          style={{ gridRow: span }}
          className="bg-accent-soft col-start-1 -z-10 rounded-md"
        />
        {rows.map((row, index) => (
          <Text
            key={row}
            as="span"
            size="sm"
            className="col-start-1 block px-3 py-1.5"
            style={{ gridRow: index + 1 }}
          >
            {row}
          </Text>
        ))}
      </Grid>
    </Stack>
  )
}
