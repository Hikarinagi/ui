'use client'

import { Settings } from 'lucide-react'
import { Button, Dialog, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Dialog
      title="对话框标题"
      icon={<Settings />}
      titleContent="自定义标题"
      renderContent={() => <Text>图标与标题内容分别由插槽提供。</Text>}
    >
      <Button variant="outline" tone="neutral">
        标题插槽
      </Button>
    </Dialog>
  )
}
