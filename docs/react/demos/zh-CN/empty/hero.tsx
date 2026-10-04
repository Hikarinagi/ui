import { Button, Empty } from '@hina-ui/react'

export default function Demo() {
  return (
    <Empty
      title="还没有书评"
      description="读完一本书之后，来写第一篇。"
      className="w-96"
      actions={<Button size="sm">写书评</Button>}
    />
  )
}
