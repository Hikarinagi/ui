import { MessageSquare } from 'lucide-react'
import { Panel, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Panel title="评论" count={128} className="w-96" icon={<MessageSquare />}>
      <Text>按时间倒序排列，最新的在前。</Text>
    </Panel>
  )
}
