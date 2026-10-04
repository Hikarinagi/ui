import { Prose } from '@hina-ui/react'

export default function Demo() {
  return (
    <Prose className="max-w-xl">
      <h2>Spice and Wolf</h2>
      <p>
        This is rich text coming from a backend. Paragraphs, headings, lists and quotations are all
        handled by the container, so the caller does not style each tag.
      </p>
      <blockquote>The sound of turning pages is the only noise a library allows.</blockquote>
      <ul>
        <li>Volume One: Setting Out</li>
        <li>Volume Two: Open Sea</li>
      </ul>
    </Prose>
  )
}
