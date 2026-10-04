import { Prose } from '@hina-ui/react'

export default function Demo() {
  return (
    <Prose className="max-w-md">
      <p>Lists in body content need no separate component.</p>
      <ul>
        <li>An unordered list</li>
        <li>Matching the component</li>
      </ul>
      <ol>
        <li>An ordered list</li>
        <li>The same applies</li>
      </ol>
    </Prose>
  )
}
