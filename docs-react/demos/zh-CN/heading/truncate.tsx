import { Heading } from '@hina-ui/react'

export default function Demo() {
  return (
    <Heading level={3} truncate className="max-w-xs">
      很长很长的章节标题会在容器边界处截断并显示省略号
    </Heading>
  )
}
