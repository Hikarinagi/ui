import { Button, Popconfirm } from '@hina-ui/react'

export default function Demo() {
  return (
    <Popconfirm
      title="移除这位成员？"
      description="移除后对方将无法访问这个项目。"
      tone="danger"
      confirmText="移除"
    >
      <Button variant="outline" tone="danger">
        移除成员
      </Button>
    </Popconfirm>
  )
}
