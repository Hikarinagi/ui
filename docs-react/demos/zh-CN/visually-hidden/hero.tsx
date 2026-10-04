import { Star } from 'lucide-react'
import { Button, VisuallyHidden } from '@hina-ui/react'

export default function Demo() {
  return (
    <Button variant="ghost" tone="neutral" iconOnly>
      <Star />
      <VisuallyHidden>收藏这部作品</VisuallyHidden>
    </Button>
  )
}
