<script setup lang="ts">
  import { Button, Inline } from '@hina-ui/vue'
  import { NuxtLink } from '#components'
  import { primary } from '~/nav'

  defineOptions({ name: 'DocsHeader' })

  const route = useRoute()
  const { t } = useI18n()
  const localePath = useLocalePath()

  const active = (match: string) => route.path.replace(/^\/en(?=\/|$)/, '').startsWith(match)
</script>

<template>
  <slot name="leading" />
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
