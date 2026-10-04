import { Star } from 'lucide-react'
import { IconButton, Inline } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline align="center">
      <IconButton label="Small" size="sm" variant="outline">
        <Star />
      </IconButton>
      <IconButton label="Medium" size="md" variant="outline">
        <Star />
      </IconButton>
      <IconButton label="Large" size="lg" variant="outline">
        <Star />
      </IconButton>
    </Inline>
  )
}
