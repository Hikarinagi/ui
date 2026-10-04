'use client'

import {
  Card,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Masonry,
  Stack,
  Text,
} from '@hina-ui/react'
import { masonryNotes } from '../../../../docs/app/demos/masonry'

const items = masonryNotes('zh-CN')

export default function Demo() {
  return (
    <Masonry
      items={items}
      getKey={item => item.id}
      minColumnWidth={180}
      label="可展开的设计笔记"
      className="max-w-2xl"
    >
      {({ item }) => (
        <Card>
          <Stack gap="sm">
            <Text weight="medium" size="sm">
              {item.title}
            </Text>
            <Text size="sm" tone="muted">
              {item.body}
            </Text>
            <Collapsible>
              <CollapsibleTrigger className="text-sm">详细说明</CollapsibleTrigger>
              <CollapsibleContent>
                <Text size="sm" tone="muted" className="pt-3">
                  {item.detail}
                </Text>
              </CollapsibleContent>
            </Collapsible>
          </Stack>
        </Card>
      )}
    </Masonry>
  )
}
