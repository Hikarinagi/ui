import { Button, Empty } from '@hina-ui/react'

export default function Demo() {
  return (
    <Empty
      title="还没有书单"
      description="把想一起读的书收进一份书单。"
      className="w-96"
      actions={
        <>
          <Button size="sm">新建书单</Button>
          <Button size="sm" variant="ghost" tone="neutral">
            了解书单
          </Button>
        </>
      }
    />
  )
}
