import { Button, Heading, Inline } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline justify="between" className="bg-inset w-full rounded-md p-3">
      <Heading level={3} size="md">
        阅读记录
      </Heading>
      <Button size="sm" variant="soft" tone="neutral">
        全部清除
      </Button>
    </Inline>
  )
}
