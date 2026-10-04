import { Inline, Link } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline align="center" className="gap-6">
      <Link href="#underline">不带下划线</Link>
      <Link href="#underline" underline>
        带下划线
      </Link>
    </Inline>
  )
}
