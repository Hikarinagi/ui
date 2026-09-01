<script setup lang="ts">
  import { BookOpen, Home, Library, Settings, User } from '@lucide/vue'
  import { Button, Drawer, NavLink, Stack } from '@hikarinagi/ui'
</script>

<template>
  <Drawer title="Navigation" side="start" size="sm">
    <Button variant="outline" tone="neutral">Menu</Button>
    <template #content>
      <Stack gap="xs">
        <NavLink href="#" label="Home" active>
          <template #icon>
            <Home />
          </template>
          Home
        </NavLink>
        <NavLink href="#" label="Library">
          <template #icon>
            <Library />
          </template>
          Library
        </NavLink>
        <NavLink href="#" label="Reading history">
          <template #icon>
            <BookOpen />
          </template>
          Reading history
        </NavLink>
        <NavLink href="#" label="Profile">
          <template #icon>
            <User />
          </template>
          Profile
        </NavLink>
        <NavLink href="#" label="Settings">
          <template #icon>
            <Settings />
          </template>
          Settings
        </NavLink>
      </Stack>
    </template>
  </Drawer>
</template>
