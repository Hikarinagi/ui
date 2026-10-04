import { NavLink, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack gap="none" as="nav" className="w-full max-w-56">
      <NavLink href="#" active>
        My shelf
      </NavLink>
      <NavLink href="#">Favourites</NavLink>
      <NavLink href="#" disabled>
        Creator centre
      </NavLink>
    </Stack>
  )
}
