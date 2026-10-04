'use client'

import NextLink from 'next/link'
import { Link } from '@hina-ui/react'

export default function Demo() {
  return (
    <Link as={NextLink} href="/en/components/button" underline>
      Go to the Button page
    </Link>
  )
}
