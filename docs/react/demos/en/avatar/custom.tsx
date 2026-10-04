import { Bot } from 'lucide-react'
import { Avatar, Inline } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline>
      <Avatar>
        <Bot />
      </Avatar>
      <Avatar>★</Avatar>
    </Inline>
  )
}
