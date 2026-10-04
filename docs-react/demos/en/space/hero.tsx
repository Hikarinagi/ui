import { Bell, Search } from 'lucide-react'
import { Card, Heading, IconButton, Inline, Space, Tag } from '@hina-ui/react'

export default function Demo() {
  return (
    <Card className="w-full max-w-lg">
      <Inline>
        <Heading level={3} size="md">
          Library
        </Heading>
        <Tag>128 books</Tag>
        <Space />
        <IconButton label="Search" variant="ghost">
          <Search />
        </IconButton>
        <IconButton label="Notifications" variant="ghost">
          <Bell />
        </IconButton>
      </Inline>
    </Card>
  )
}
