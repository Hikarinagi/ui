'use client'

import { useState } from 'react'
import { Link2, Mail, MessageCircle, QrCode } from 'lucide-react'
import { Button, ListItem, List, Sheet, Stack, Text } from '@hina-ui/react'

const targets = [
  { label: '复制链接', icon: Link2 },
  { label: '发送私信', icon: MessageCircle },
  { label: '通过邮件', icon: Mail },
  { label: '生成二维码', icon: QrCode },
]

export default function Demo() {
  const [picked, setPicked] = useState('')

  return (
    <Stack gap="sm" align="start">
      <Sheet
        title="分享这篇文章"
        description="选择一个去处。"
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
          分享
        </Button>
      </Sheet>
      {picked && (
        <Text tone="muted" size="sm">
          选择了：{picked}
        </Text>
      )}
    </Stack>
  )
}
