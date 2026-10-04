import { Button, Inline, Space } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline className="bg-inset w-full max-w-md rounded-md p-3">
      <Button size="sm" variant="soft" tone="neutral">
        左
      </Button>
      <Space />
      <Button size="sm" variant="soft" tone="neutral">
        右
      </Button>
    </Inline>
  )
}
