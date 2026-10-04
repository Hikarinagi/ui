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
        访问 Hikarinagi
      </Button>
      <Button
        as="a"
        href="https://www.hikarinagi.com"
        target="_blank"
        rel="noreferrer"
        variant="link"
      >
        了解更多
      </Button>
    </Inline>
  )
}
