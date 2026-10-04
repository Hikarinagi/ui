import { Prose } from '@hina-ui/react'

export default function Demo() {
  return (
    <Prose className="max-w-lg">
      <p>
        正文中的
        <a href="#prose">链接</a>
        不需要单独引入组件，默认带下划线。
      </p>
    </Prose>
  )
}
