'use client'

import { useEffect, useRef, useState } from 'react'
import { Button, Card, Masonry, Skeleton, Stack, Text } from '@hina-ui/react'
import { masonryNotes } from '../../masonry'

const notes = masonryNotes('en')

export default function Demo() {
  const [count, setCount] = useState(6)
  const [loading, setLoading] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const items = Array.from({ length: count }, (_, id) => ({ ...notes[id % notes.length]!, id }))

  function reload() {
    clearTimeout(timer.current)
    setCount(0)
    setLoading(true)
    timer.current = setTimeout(() => {
      setCount(6)
      setLoading(false)
    }, 800)
  }

  useEffect(() => () => clearTimeout(timer.current), [])

  return (
    <Stack className="w-full max-w-2xl">
      <Button
        className="self-start"
        variant="outline"
        size="sm"
        disabled={loading}
        onClick={reload}
      >
        Reload to preview pending
      </Button>
      <Masonry
        items={items}
        getKey={item => item.id}
        minColumnWidth={180}
        loading={loading}
        label="Initial load of design notes"
        pending={
          <Stack aria-hidden="true" className="block columns-[180px] gap-[var(--hn-masonry-gap)]">
            {[2, 4, 3, 2, 5, 3].map((lines, index) => (
              <Card key={index} className="mb-[var(--hn-masonry-row-gap)] break-inside-avoid">
                <Stack gap="sm">
                  <Skeleton className="h-5 w-2/3 rounded" />
                  {Array.from({ length: lines }, (_, offset) => offset + 1).map(line => (
                    <Skeleton
                      key={line}
                      className={`h-4 rounded ${line === lines ? 'w-4/5' : 'w-full'}`}
                    />
                  ))}
                </Stack>
              </Card>
            ))}
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
      <Text size="sm" tone="muted">
        CSS columns arrange varied-height skeletons without measuring on the first SSR paint. Reload
        simulates the first request.
      </Text>
    </Stack>
  )
}
