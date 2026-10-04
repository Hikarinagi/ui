import { Prose } from '@hina-ui/react'

export default function Demo() {
  return (
    <Prose
      className="max-w-lg"
      dangerouslySetInnerHTML={{ __html: '<h3>标题</h3><p>一段来自接口的 HTML。</p>' }}
    />
  )
}
