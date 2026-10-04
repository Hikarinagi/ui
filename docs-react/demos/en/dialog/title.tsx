'use client'

import { Settings } from 'lucide-react'
import { Button, Dialog, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Dialog
      title="Dialog title"
      icon={<Settings />}
      titleContent="Custom title"
      renderContent={() => (
        <Text>The icon and title content are provided through separate slots.</Text>
      )}
    >
      <Button variant="outline" tone="neutral">
        Title slots
      </Button>
    </Dialog>
  )
}
