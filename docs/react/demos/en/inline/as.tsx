import { Inline, Link } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline as="nav" gap="lg" aria-label="Footer navigation">
      <Link href="#">About</Link>
      <Link href="#">Help</Link>
      <Link href="#">Terms</Link>
    </Inline>
  )
}
