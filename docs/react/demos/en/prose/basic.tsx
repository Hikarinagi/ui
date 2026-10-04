import { Prose } from '@hina-ui/react'

export default function Demo() {
  return (
    <Prose
      className="max-w-lg"
      dangerouslySetInnerHTML={{ __html: '<h3>A heading</h3><p>Some HTML from an API.</p>' }}
    />
  )
}
