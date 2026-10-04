'use client'

import { useState } from 'react'
import { Link2, Mail, MessageCircle, QrCode } from 'lucide-react'
import { Button, ListItem, List, Sheet, Stack, Text } from '@hina-ui/react'

const targets = [
  { label: 'Copy link', icon: Link2 },
  { label: 'Direct message', icon: MessageCircle },
  { label: 'Email', icon: Mail },
  { label: 'QR code', icon: QrCode },
]

export default function Demo() {
  const [picked, setPicked] = useState('')

  return (
    <Stack gap="sm" align="start">
      <Sheet
        title="Share this article"
        description="Pick where it goes."
        renderContent={({ close }) => (
          <List>
            {targets.map(target => (
              <ListItem key={target.label}>
                <Button
                  variant="ghost"
                  tone="neutral"
                  className="w-full justify-start"
                  icon={<target.icon />}
                  onClick={() => {
                    setPicked(target.label)
                    close()
                  }}
                >
                  {target.label}
                </Button>
              </ListItem>
            ))}
          </List>
        )}
      >
        <Button variant="outline" tone="neutral">
          Share
        </Button>
      </Sheet>
      {picked && (
        <Text tone="muted" size="sm">
          Picked: {picked}
        </Text>
      )}
    </Stack>
  )
}
