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
          看简介
        </Button>
        <Button size="sm" variant="soft" tone="neutral" onClick={() => setOpen('staff')}>
          看制作人员
        </Button>
      </Inline>
      <Accordion value={open} onValueChange={setOpen}>
        <AccordionItem value="intro">
          <AccordionTrigger>作品简介</AccordionTrigger>
          <AccordionContent>
            <Text tone="muted" size="sm">
              转学第一天，我在天台遇见了那个抱着旧相机的少女。
            </Text>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="staff">
          <AccordionTrigger>制作人员</AccordionTrigger>
          <AccordionContent>
            <Text tone="muted" size="sm">
              原作、脚本与原画均由同一位作者完成。
            </Text>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Stack>
  )
}
