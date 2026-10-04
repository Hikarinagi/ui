import { Star } from 'lucide-react'
import { Button, VisuallyHidden } from '@hina-ui/react'

export default function Demo() {
  return (
    <Button variant="ghost" tone="neutral" iconOnly>
      <Star />
      <VisuallyHidden>Favourite this title</VisuallyHidden>
    </Button>
  )
}
