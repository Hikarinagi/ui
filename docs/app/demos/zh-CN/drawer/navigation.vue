<script setup lang="ts">
  import { BookOpen, Home, Library, Settings, User } from '@lucide/vue'
  import { Button, Drawer, NavLink, Stack } from '@hina-ui/vue'
</script>

<template>
  <Drawer title="导航" side="start" size="sm">
    <Button variant="outline" tone="neutral">菜单</Button>
    <template #content>
      <Stack gap="xs">
        <NavLink href="#" label="首页" active>
          <template #icon>
            <Home />
          </template>
          首页
        </NavLink>
        <NavLink href="#" label="书库">
          <template #icon>
            <Library />
          </template>
          书库
        </NavLink>
        <NavLink href="#" label="阅读记录">
          <template #icon>
            <BookOpen />
          </template>
          阅读记录
        </NavLink>
        <NavLink href="#" label="个人资料">
          <template #icon>
            <User />
          </template>
          个人资料
        </NavLink>
        <NavLink href="#" label="设置">
          <template #icon>
            <Settings />
          </template>
          设置
        </NavLink>
      </Stack>
    </template>
  </Drawer>
</template>
