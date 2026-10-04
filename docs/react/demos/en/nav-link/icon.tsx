import { CircleUser, House, Settings } from 'lucide-react'
import { NavLink, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack gap="none" as="nav" className="w-full max-w-56">
      <NavLink href="#" active icon={<House />}>
        Overview
      </NavLink>
      <NavLink href="#" icon={<CircleUser />}>
        Account
      </NavLink>
      <NavLink href="#" icon={<Settings />}>
        Settings
      </NavLink>
    </Stack>
  )
}
