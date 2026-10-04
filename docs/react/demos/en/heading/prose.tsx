import { Prose } from '@hina-ui/react'

export default function Demo() {
  return (
    <Prose className="max-w-lg">
      <h2>A heading in body content</h2>
      <p>Rendering Markdown needs no tag replacement.</p>
      <h3>The next level down</h3>
      <p>Levels map to sizes exactly as they do in the component.</p>
    </Prose>
  )
}
