import { Prose } from '@hina-ui/react'

export default function Demo() {
  return (
    <Prose className="max-w-lg">
      <p>
        A <a href="#prose">link</a> in body content needs no separate component and is underlined by
        default.
      </p>
    </Prose>
  )
}
