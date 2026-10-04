'use client'

import NextLink from 'next/link'
import { Link } from '@hina-ui/react'

export default function Demo() {
  return (
    <Link as={NextLink} href="/components/button" underline>
      跳转到 Button 页
    </Link>
  )
}
