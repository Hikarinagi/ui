import { Banner, Link } from '@hina-ui/react'

export default function Demo() {
  return (
    <Banner closable>
      Hina UI 1.2 is out.
      <Link href="#" underline>
        Read the release notes
      </Link>
    </Banner>
  )
}
