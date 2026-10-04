import { Prose } from '@hina-ui/react'

export default function Demo() {
  return (
    <Prose className="max-w-sm">
      <p>正文中的描述列表不需要单独引入组件。</p>
      <dl>
        <dt>格式</dt>
        <dd>EPUB、PDF</dd>
        <dt>大小</dt>
        <dd>18.4 MB</dd>
      </dl>
    </Prose>
  )
}
