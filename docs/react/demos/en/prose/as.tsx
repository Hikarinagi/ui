import { Prose } from '@hina-ui/react'

export default function Demo() {
  return (
    <Prose as="article" className="max-w-lg">
      <h3>Rendered as an article</h3>
      <p>The container tag comes from as; the body styling is unchanged.</p>
    </Prose>
  )
}
