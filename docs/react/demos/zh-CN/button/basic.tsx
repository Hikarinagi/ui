import { Button, Inline } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline>
      <Button>保存</Button>
      <Button variant="outline" tone="neutral">
        取消
      </Button>
    </Inline>
  )
}
