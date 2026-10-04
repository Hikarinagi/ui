import { Button, ButtonGroup } from '@hina-ui/react'

export default function Demo() {
  return (
    <ButtonGroup
      label="排序"
      className="[&>*:first-child]:rounded-s-full [&>*:last-child]:rounded-e-full"
    >
      <Button variant="soft" tone="neutral" className="px-6">
        最新
      </Button>
      <Button variant="soft" tone="neutral" className="px-6">
        最热
      </Button>
      <Button variant="soft" tone="neutral" className="px-6">
        评分
      </Button>
    </ButtonGroup>
  )
}
