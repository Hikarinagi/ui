import { Prose } from '@hina-ui/react'

export default function Demo() {
  return (
    <Prose className="max-w-lg">
      <p>
        正文中的 <code>code</code> 标签不需要单独引入组件。
      </p>
      <p>它与组件的呈现完全一致。</p>
    </Prose>
  )
}
