import { Card, Prose } from '@hina-ui/react'

export default function Demo() {
  return (
    <Card padded className="w-full max-w-lg">
      <Prose>
        <h3>首尾不留外边距</h3>
        <p>容器内第一个与最后一个元素的外边距被清除，因此贴合卡片的内边距。</p>
      </Prose>
    </Card>
  )
}
