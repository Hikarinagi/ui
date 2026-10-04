'use client'

import NextLink from 'next/link'
import { PrevNext, PrevNextLink } from '@hina-ui/react'

export default function Demo() {
  return (
    <PrevNext className="w-full max-w-2xl">
      <PrevNextLink direction="prev" as={NextLink} href="/en/components/nav-link">
        NavLink
      </PrevNextLink>
      <PrevNextLink direction="next" as={NextLink} href="/en/components/anchor">
        Anchor
      </PrevNextLink>
    </PrevNext>
  )
}
