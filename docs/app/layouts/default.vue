<script setup lang="ts">
  import {
    AppShell,
    NavLink,
    Sidebar,
    SidebarGroup,
    SidebarTrigger,
    Text,
    Toaster,
  } from '@hina-ui/vue'
  import { NuxtLink } from '#components'
  import { nav } from '~/nav'

  const componentName = useComponentName()
  const route = useRoute()
  const { t } = useI18n()
  const localePath = useLocalePath()

  const current = (to: string) => route.path === localePath(to)

  const shell = shallowRef<InstanceType<typeof AppShell>>()
  useScrollRestore('main', () => shell.value?.mainArea)

  const drawerOpen = ref(false)
  useNuxtApp().hook('page:finish', () => {
    drawerOpen.value = false
  })
</script>

<template>
  <AppShell
    ref="shell"
    v-model:mobile-open="drawerOpen"
    :auto-close="false"
    collapsible="hidden"
    restore-key="main"
  >
    <template #banner>
      <DocsBanner />
    </template>
    <template #header>
      <DocsHeader>
        <template #leading><SidebarTrigger /></template>
      </DocsHeader>
    </template>
    <template #sidebar>
      <Sidebar :label="t('nav.docsNav')">
        <SidebarGroup v-for="group in nav" :key="group.label" :label="t(group.label)">
          <NavLink
            v-for="item in group.items"
            :key="item.to"
            :as="NuxtLink"
            :to="localePath(item.to)"
            :label="item.label ?? t(item.labelI18n!)"
            :active="current(item.to)"
          >
            {{ item.label ?? t(item.labelI18n!) }}
            <Text v-if="componentName(item.to)" as="span" size="sm" tone="faint" class="ms-1.5">
              {{ componentName(item.to) }}
            </Text>
          </NavLink>
        </SidebarGroup>
      </Sidebar>
    </template>
    <slot />
    <Toaster />
  </AppShell>
</template>
