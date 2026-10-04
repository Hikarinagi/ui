'use client'

import { Settings } from 'lucide-react'
import { Button, Inline, Sheet, Tag, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Sheet
      title="Panel title"
      icon={<Settings />}
      titleContent={
        <Inline as="span" wrap={false} className="inline-flex gap-2">
          Custom title
          <Tag size="sm" tone="neutral">
            Optional
          </Tag>
        </Inline>
      }
      renderContent={() => (
        <Text>The icon is separate, and the title slot combines text with a tag.</Text>
      )}
    >
      <Button variant="outline" tone="neutral">
        Title slots
      </Button>
    </Sheet>
  )
}
