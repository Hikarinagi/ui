import { ArrowUpRight } from 'lucide-react'
import { Button, Inline } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline>
      <Button
        as="a"
        href="https://www.hikarinagi.com"
        target="_blank"
        rel="noreferrer"
        variant="outline"
        trailing={<ArrowUpRight />}
      >
        Visit Hikarinagi
      </Button>
      <Button
        as="a"
        href="https://www.hikarinagi.com"
        target="_blank"
        rel="noreferrer"
        variant="link"
      >
        Learn more
      </Button>
    </Inline>
  )
}
