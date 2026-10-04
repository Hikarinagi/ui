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

const items = masonryNotes('en')

export default function Demo() {
  return (
    <Masonry
      items={items}
      getKey={item => item.id}
      minColumnWidth={180}
      label="Expandable design notes"
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
              <CollapsibleTrigger className="text-sm">Details</CollapsibleTrigger>
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
