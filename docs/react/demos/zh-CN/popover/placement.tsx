import { Button, Inline, Popover, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline align="center" className="gap-6">
      <Popover align="start" content={<Text size="sm">与触发器的起始边对齐。</Text>}>
        <Button variant="outline" tone="neutral">
          start
        </Button>
      </Popover>
      <Popover align="center" content={<Text size="sm">与触发器居中对齐。</Text>}>
        <Button variant="outline" tone="neutral">
          center
        </Button>
      </Popover>
      <Popover side="right" align="start" content={<Text size="sm">在触发器右侧展开。</Text>}>
        <Button variant="outline" tone="neutral">
          right
        </Button>
      </Popover>
      <Popover side="top" content={<Text size="sm">在触发器上方展开。</Text>}>
        <Button variant="outline" tone="neutral">
          top
        </Button>
      </Popover>
    </Inline>
  )
}
