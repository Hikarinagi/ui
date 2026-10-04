import { Prose } from '@hina-ui/react'

export default function Demo() {
  return (
    <Prose className="max-w-lg">
      <p>正文中的引用不需要单独引入组件。</p>
      <blockquote>写在文章里的引用块，会自动获得同样的样式。</blockquote>
      <p>它与组件的呈现完全一致。</p>
    </Prose>
  )
}
