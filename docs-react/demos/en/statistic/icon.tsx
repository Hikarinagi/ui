import { Bookmark, MessageSquare } from 'lucide-react'
import { Card, Inline, Statistic } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline gap="md" align="stretch">
      <Card className="w-56">
        <Statistic label="Bookmarks" value={318} icon={<Bookmark />} />
      </Card>
      <Card className="w-56">
        <Statistic label="Comments" value={1024} icon={<MessageSquare />} />
      </Card>
    </Inline>
  )
}
