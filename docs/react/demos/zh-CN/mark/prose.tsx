import { Prose } from '@hina-ui/react'

export default function Demo() {
  return (
    <Prose className="max-w-lg">
      <p>
        正文中的 <mark>mark</mark> 标签不需要单独引入组件。
      </p>
    </Prose>
  )
}
