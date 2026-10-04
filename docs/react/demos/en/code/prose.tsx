import { Prose } from '@hina-ui/react'

export default function Demo() {
  return (
    <Prose className="max-w-lg">
      <p>
        A <code>code</code> tag in body content needs no separate component.
      </p>
      <p>It matches the component exactly.</p>
    </Prose>
  )
}
