<script setup lang="ts">
  import {
    AppShell,
    Button,
    Inline,
    NavLink,
    Sidebar,
    SidebarGroup,
    SidebarTrigger,
    Text,
    Toaster,
    provideUiLocale,
    enUS,
    zhCN,
  } from '@hina-ui/vue'
  import { NuxtLink } from '#components'
  import { nav, primary } from '~/nav'

  const componentName = useComponentName()
  const route = useRoute()
  const { t, locale } = useI18n()
  const localePath = useLocalePath()

  provideUiLocale(() => (locale.value === 'en' ? enUS : zhCN))

  useHead(useLocaleHead())

  const active = (match: string) => route.path.replace(/^\/en(?=\/|$)/, '').startsWith(match)
  const current = (to: string) => route.path === localePath(to)

  const shell = shallowRef<InstanceType<typeof AppShell>>()
  useScrollRestore('main', () => shell.value?.mainArea)

  const drawerOpen = ref(false)
  useNuxtApp().hook('page:finish', () => {
    drawerOpen.value = false
  })
</script>

<template>
  <NuxtLoadingIndicator color="var(--hn-accent)" :height="2" />
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
      <SidebarTrigger />
      <Button :as="NuxtLink" :to="localePath('/')" variant="ghost" tone="neutral" size="sm">
        <DocsWordmark />
      </Button>
      <Inline gap="xs" class="max-md:hidden">
        <Button
          v-for="item in primary"
          :key="item.to"
          :as="NuxtLink"
          :to="localePath(item.to)"
          variant="ghost"
          size="sm"
          :tone="active(item.match) ? 'accent' : 'neutral'"
          :aria-current="active(item.match) ? 'page' : undefined"
        >
          {{ t(item.label) }}
        </Button>
      </Inline>
      <Inline gap="xs" class="ms-auto">
        <DocsSearch />
        <DocsGithub />
        <DocsLocaleToggle />
        <DocsThemeToggle />
      </Inline>
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
    <NuxtPage />
    <Toaster />
  </AppShell>
</template>
