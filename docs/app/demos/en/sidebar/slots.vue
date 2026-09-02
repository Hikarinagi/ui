<script setup lang="ts">
  import { BookMarked, House, Star } from '@lucide/vue'
  import { AppShell, Avatar, Inline, NavLink, Sidebar, Text } from '@hina-ui/vue'
</script>

<template>
  <AppShell class="border-line h-80 w-full rounded-lg border">
    <template #sidebar>
      <Sidebar label="Site navigation">
        <template #header>
          <Inline gap="sm" align="center">
            <BookMarked class="size-5" aria-hidden="true" />
            <Text weight="medium">Hikari Library</Text>
          </Inline>
        </template>

        <NavLink href="#" active label="Overview">
          <template #icon><House /></template>
          Overview
        </NavLink>
        <NavLink href="#" label="Favourites">
          <template #icon><Star /></template>
          Favourites
        </NavLink>

        <template #footer>
          <Inline gap="sm" align="center">
            <Avatar size="sm" name="Shion" />
            <Text size="sm" tone="muted">Shion</Text>
          </Inline>
        </template>
      </Sidebar>
    </template>

    <Text size="sm" tone="muted" class="block p-6">
      The header and footer stay at either end and do not scroll with the entries.
    </Text>
  </AppShell>
</template>
