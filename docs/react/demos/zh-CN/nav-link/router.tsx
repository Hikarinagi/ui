'use client'

import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import { NavLink, Stack } from '@hina-ui/react'

const links = [
  { to: '/components/breadcrumb', label: 'Breadcrumb' },
  { to: '/components/nav-link', label: 'NavLink' },
  { to: '/components/splitter', label: 'Splitter' },
]

export default function Demo() {
  const pathname = usePathname()
  return (
    <Stack gap="none" as="nav" className="w-full max-w-56">
      {links.map(link => (
        <NavLink key={link.to} as={NextLink} href={link.to} active={pathname === link.to}>
          {link.label}
        </NavLink>
      ))}
    </Stack>
  )
}
