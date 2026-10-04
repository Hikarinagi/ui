import { Button, ButtonGroup } from '@hina-ui/react'

export default function Demo() {
  return (
    <ButtonGroup label="视图">
      <Button variant="outline" tone="neutral">
        列表
      </Button>
      <Button variant="outline" tone="neutral">
        网格
      </Button>
      <Button variant="outline" tone="neutral">
        时间线
      </Button>
    </ButtonGroup>
  )
}
