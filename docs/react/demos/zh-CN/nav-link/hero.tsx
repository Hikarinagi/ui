'use client'

import { BookOpen, Gamepad2, House, Library } from 'lucide-react'
import { NavLink, Stack } from '@hina-ui/react'

const items = [
  { icon: House, label: '首页', active: false },
  { icon: Gamepad2, label: 'Galgame', active: true },
  { icon: BookOpen, label: '轻小说', active: false },
  { icon: Library, label: '漫画', active: false },
]

export default function Demo() {
  return (
    <Stack gap="none" as="nav" className="w-full max-w-56">
      {items.map(item => (
        <NavLink key={item.label} href="#" active={item.active} icon={<item.icon />}>
          {item.label}
        </NavLink>
      ))}
    </Stack>
  )
}
