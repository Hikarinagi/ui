import { Prose } from '@hina-ui/react'

export default function Demo() {
  return (
    <Prose className="max-w-lg">
      <p>Quotations in body content need no separate component.</p>
      <blockquote>A blockquote written in an article picks up the same styling.</blockquote>
      <p>It matches the component exactly.</p>
    </Prose>
  )
}
