import { Button, Tooltip } from '@hina-ui/react'

export default function Demo() {
  return (
    <Tooltip content="保存后立刻发布">
      <Button variant="outline" tone="neutral">
        发布
      </Button>
    </Tooltip>
  )
}
