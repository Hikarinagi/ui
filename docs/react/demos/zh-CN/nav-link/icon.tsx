import { CircleUser, House, Settings } from 'lucide-react'
import { NavLink, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack gap="none" as="nav" className="w-full max-w-56">
      <NavLink href="#" active icon={<House />}>
        概览
      </NavLink>
      <NavLink href="#" icon={<CircleUser />}>
        账号
      </NavLink>
      <NavLink href="#" icon={<Settings />}>
        设置
      </NavLink>
    </Stack>
  )
}
