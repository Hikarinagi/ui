import { Prose } from '@hina-ui/react'

export default function Demo() {
  return (
    <Prose className="max-w-sm">
      <p>Description lists in body content need no separate component.</p>
      <dl>
        <dt>Formats</dt>
        <dd>EPUB, PDF</dd>
        <dt>Size</dt>
        <dd>18.4 MB</dd>
      </dl>
    </Prose>
  )
}
