import { Button, Inline } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline>
      <Button variant="soft" tone="neutral">
        保存
      </Button>
      <Button variant="soft" tone="neutral">
        另存为
      </Button>
      <Button variant="soft" tone="neutral">
        导出
      </Button>
    </Inline>
  )
}
