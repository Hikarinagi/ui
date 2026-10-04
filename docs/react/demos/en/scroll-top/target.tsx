'use client'

import { useRef, useState } from 'react'
import {
  Button,
  Card,
  FormField,
  ScrollArea,
  ScrollTop,
  Stack,
  Switch,
  Text,
  type ScrollAreaHandle,
} from '@hina-ui/react'

export default function Demo() {
  const area = useRef<ScrollAreaHandle>(null)
  const [show, setShow] = useState(true)

  return (
    <Stack className="w-full max-w-md" gap="sm">
      <FormField label="Mount the scroll area" orientation="horizontal">
        <Switch checked={show} onCheckedChange={setShow} />
      </FormField>
      <Button
        variant="outline"
        tone="neutral"
        className="self-start"
        disabled={!show}
        onClick={() => area.current?.viewport?.scrollTo({ top: 500, behavior: 'instant' })}
      >
        Scroll to the middle
      </Button>
      <Card padded={false} className="relative h-64 overflow-hidden">
        {show ? (
          <ScrollArea ref={area} className="h-full" shadow={false} focusable label="Review log">
            <Stack className="p-5 pb-24" gap="lg">
              {Array.from({ length: 20 }, (_, i) => i + 1).map(i => (
                <Text key={i} size="sm" className="border-line border-b pb-3">
                  Review log {i} · Review interactions and visual details
                </Text>
              ))}
            </Stack>
          </ScrollArea>
        ) : (
          <Text size="sm" tone="muted" className="p-5">
            The scroll area is unmounted
          </Text>
        )}
        <ScrollTop
          target={() => area.current?.viewport}
          position="absolute"
          threshold={120}
          offset={16}
        />
      </Card>
      <Text size="sm" tone="muted">
        ScrollTop stays mounted. When its target is unavailable, the button hides without falling
        back to page scrolling.
      </Text>
    </Stack>
  )
}
