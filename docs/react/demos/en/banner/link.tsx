import { Banner, Link } from '@hina-ui/react'

export default function Demo() {
  return (
    <Banner tone="info">
      You are reading the docs for 1.x.
      <Link href="#" underline>
        Go to the latest version
      </Link>
    </Banner>
  )
}
