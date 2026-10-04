import { NavLink, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack gap="none" as="nav" className="w-full max-w-56">
      <NavLink href="#" active>
        我的书架
      </NavLink>
      <NavLink href="#">收藏</NavLink>
      <NavLink href="#" disabled>
        创作中心
      </NavLink>
    </Stack>
  )
}
