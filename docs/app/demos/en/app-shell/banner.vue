<script setup lang="ts">
  import {
    AppShell,
    Banner,
    Heading,
    Link,
    NavLink,
    Sidebar,
    SidebarTrigger,
    Text,
  } from '@hina-ui/vue'
</script>

<template>
  <AppShell collapsible="hidden" class="border-line h-96 w-full rounded-lg border">
    <template #banner>
      <Banner closable>
        Hina UI 1.2 is out.
        <Link href="#" underline>Read the release notes</Link>
      </Banner>
    </template>

    <template #sidebar>
      <Sidebar>
        <NavLink href="#" active label="Home">Home</NavLink>
        <NavLink href="#" label="My shelf">My shelf</NavLink>
      </Sidebar>
    </template>

    <template #header>
      <SidebarTrigger />
      <Heading :level="2" size="sm">Home</Heading>
    </template>

    <Text size="sm" tone="muted" class="block p-6">
      Close the banner and the sidebar and main area move up to fill the space.
    </Text>
  </AppShell>
</template>
