'use client'

import { useState } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Inline,
  Stack,
  Text,
  type AccordionProps,
} from '@hina-ui/react'

export default function Demo() {
  const [open, setOpen] = useState<AccordionProps['value']>('intro')

  return (
    <Stack className="w-full max-w-md">
      <Inline>
        <Button size="sm" variant="soft" tone="neutral" onClick={() => setOpen('intro')}>
          Show synopsis
        </Button>
        <Button size="sm" variant="soft" tone="neutral" onClick={() => setOpen('staff')}>
          Show staff
        </Button>
      </Inline>
      <Accordion value={open} onValueChange={setOpen}>
        <AccordionItem value="intro">
          <AccordionTrigger>Synopsis</AccordionTrigger>
          <AccordionContent>
            <Text tone="muted" size="sm">
              On my first day at the new school I met a girl on the roof holding an old camera.
            </Text>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="staff">
          <AccordionTrigger>Staff</AccordionTrigger>
          <AccordionContent>
            <Text tone="muted" size="sm">
              Story, script and art are all by the same author.
            </Text>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Stack>
  )
}
