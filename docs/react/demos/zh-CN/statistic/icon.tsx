import { Bookmark, MessageSquare } from 'lucide-react'
import { Card, Inline, Statistic } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline gap="md" align="stretch">
      <Card className="w-56">
        <Statistic label="收藏" value={318} icon={<Bookmark />} />
      </Card>
      <Card className="w-56">
        <Statistic label="评论" value={1024} icon={<MessageSquare />} />
      </Card>
    </Inline>
  )
}
