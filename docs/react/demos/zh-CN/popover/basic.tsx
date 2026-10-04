import { Button, Popover, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Popover
      content={
        <Text size="sm">ATRI -My Dear Moments- 由 ANIPLEX.EXE 发行，2020 年 6 月 19 日上市。</Text>
      }
    >
      <Button variant="outline" tone="neutral">
        关于这本书
      </Button>
    </Popover>
  )
}
