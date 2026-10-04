import { Star } from 'lucide-react'
import { IconButton, Inline } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline align="center">
      <IconButton label="小" size="sm" variant="outline">
        <Star />
      </IconButton>
      <IconButton label="中" size="md" variant="outline">
        <Star />
      </IconButton>
      <IconButton label="大" size="lg" variant="outline">
        <Star />
      </IconButton>
    </Inline>
  )
}
