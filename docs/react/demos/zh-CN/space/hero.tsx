import { Bell, Search } from 'lucide-react'
import { Card, Heading, IconButton, Inline, Space, Tag } from '@hina-ui/react'

export default function Demo() {
  return (
    <Card className="w-full max-w-lg">
      <Inline>
        <Heading level={3} size="md">
          书库
        </Heading>
        <Tag>128 本</Tag>
        <Space />
        <IconButton label="搜索" variant="ghost">
          <Search />
        </IconButton>
        <IconButton label="通知" variant="ghost">
          <Bell />
        </IconButton>
      </Inline>
    </Card>
  )
}
