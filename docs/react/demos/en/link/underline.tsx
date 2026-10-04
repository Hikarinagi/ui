import { Inline, Link } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline align="center" className="gap-6">
      <Link href="#underline">Without underline</Link>
      <Link href="#underline" underline>
        With underline
      </Link>
    </Inline>
  )
}
