'use client'

import { useRef, useState } from 'react'
import { ChevronsUp } from 'lucide-react'
import {
  Button,
  Card,
  FormField,
  Heading,
  ScrollArea,
  ScrollTop,
  Stack,
  Switch,
  Text,
  type ScrollAreaHandle,
} from '@hina-ui/react'

export default function Demo() {
  const area = useRef<ScrollAreaHandle>(null)
  const heading = useRef<HTMLHeadingElement>(null)
  const [instant, setInstant] = useState(false)
  function goDown() {
    area.current?.viewport?.scrollTo({ top: 450, behavior: 'instant' })
  }

  return (
    <Stack className="w-full max-w-md" gap="sm">
      <FormField label="Return instantly" orientation="horizontal">
        <Switch checked={instant} onCheckedChange={setInstant} />
      </FormField>
      <Button variant="outline" tone="neutral" className="self-start" onClick={goDown}>
        Scroll to the middle
      </Button>
      <Card padded={false} className="relative overflow-hidden">
        <ScrollArea ref={area} className="h-64" shadow={false} focusable label="Release checklist">
          <Stack className="p-5 pb-24" gap="lg">
            <Heading
              ref={heading}
              level={3}
              size="base"
              tabIndex={-1}
              className="hn-focus-ring rounded-sm"
            >
              Release checklist
            </Heading>
            {[
              'Verify core flows',
              'Check empty states',
              'Check loading and retries',
              'Check keyboard navigation',
              'Check form errors',
              'Check mobile layouts',
              'Check dark mode',
              'Check RTL',
              'Check server rendering',
              'Review documentation examples',
              'Update the changelog',
              'Confirm the release version',
            ].map(item => (
              <Text key={item} size="sm" className="border-line border-b pb-3">
                {item}
              </Text>
            ))}
          </Stack>
        </ScrollArea>
        <ScrollTop
          target={() => area.current?.viewport}
          focusTarget={() => heading.current}
          threshold={80}
          behavior={instant ? 'instant' : 'smooth'}
          position="absolute"
          offset={16}
          extended
          size="sm"
          shape="square"
          variant="soft"
          tone="accent"
          label="Back to the checklist"
        >
          <ChevronsUp />
        </ScrollTop>
      </Card>
      <Text size="sm" tone="muted">
        Returning to the top focuses the heading, so keyboard navigation can continue from there.
      </Text>
    </Stack>
  )
}
