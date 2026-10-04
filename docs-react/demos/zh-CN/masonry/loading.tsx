'use client'

import { useEffect, useRef, useState } from 'react'
import { Button, Card, Masonry, Stack, Text, Flex } from '@hina-ui/react'
import { masonryNotes } from '../../../../docs/app/demos/masonry'

const notes = masonryNotes('zh-CN')

export default function Demo() {
  const [count, setCount] = useState(6)
  const [loading, setLoading] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const items = Array.from({ length: count }, (_, id) => ({ ...notes[id % notes.length]!, id }))

  function load() {
    if (loading) return
    setLoading(true)
    timer.current = setTimeout(() => {
      setCount(value => value + 6)
      setLoading(false)
    }, 650)
  }

  useEffect(() => () => clearTimeout(timer.current), [])

  return (
    <Stack className="w-full max-w-2xl">
      <Flex wrap align="center" gap="sm">
        <Button size="sm" loading={loading} disabled={count >= 24} onClick={load}>
          追加 6 条
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={loading || count === 0}
          onClick={() => setCount(0)}
        >
          清空
        </Button>
        <Text size="sm" tone="muted">
          {count} 条笔记
        </Text>
      </Flex>
      <Masonry
        items={items}
        getKey={item => item.id}
        minColumnWidth={180}
        loading={loading}
        label="笔记列表"
        empty={
          <Stack align="center" gap="sm">
            <Text weight="medium">还没有笔记</Text>
            <Text size="sm" tone="muted">
              点击“追加 6 条”重新加载。
            </Text>
          </Stack>
        }
      >
        {({ item }) => (
          <Card>
            <Stack gap="sm">
              <Text size="sm" weight="medium">
                {item.title}
              </Text>
              <Text size="sm" tone="muted">
                {item.body}
              </Text>
            </Stack>
          </Card>
        )}
      </Masonry>
    </Stack>
  )
}
