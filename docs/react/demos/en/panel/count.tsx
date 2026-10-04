import { MessageSquare } from 'lucide-react'
import { Panel, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Panel title="Comments" count={128} className="w-96" icon={<MessageSquare />}>
      <Text>Newest first.</Text>
    </Panel>
  )
}
