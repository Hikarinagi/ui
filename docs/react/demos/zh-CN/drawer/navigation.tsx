'use client'

import { BookOpen, Home, Library, Settings, User } from 'lucide-react'
import { Button, Drawer, NavLink, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Drawer
      title="导航"
      side="start"
      size="sm"
      renderContent={() => (
        <Stack gap="xs">
          <NavLink href="#" label="首页" active icon={<Home />}>
            首页
          </NavLink>
          <NavLink href="#" label="书库" icon={<Library />}>
            书库
          </NavLink>
          <NavLink href="#" label="阅读记录" icon={<BookOpen />}>
            阅读记录
          </NavLink>
          <NavLink href="#" label="个人资料" icon={<User />}>
            个人资料
          </NavLink>
          <NavLink href="#" label="设置" icon={<Settings />}>
            设置
          </NavLink>
        </Stack>
      )}
    >
      <Button variant="outline" tone="neutral">
        菜单
      </Button>
    </Drawer>
  )
}
