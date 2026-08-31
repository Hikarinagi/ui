<script setup lang="ts">
  import type { Component } from 'vue'
  import { NuxtLink } from '#components'
  import { Card, Heading, Ripple, SimpleGrid, Text } from '@hikarinagi/ui'
  import { components } from '~/nav'

  const props = defineProps<{ slug: string }>()

  const { t, locale } = useI18n()
  const localePath = useLocalePath()

  const heroes = import.meta.glob<{ default: Component }>('../../demos/*/*/hero.vue', {
    eager: true,
  })

  const items = computed(() =>
    components
      .filter(item => item.category === props.slug)
      .map(item => {
        const name = item.to.slice(item.to.lastIndexOf('/') + 1)
        return { ...item, preview: heroes[`../../demos/${locale.value}/${name}/hero.vue`]?.default }
      }),
  )
</script>

<template>
  <SimpleGrid min="20rem" gap="lg">
    <Card
      v-for="item in items"
      :key="item.to"
      :padded="false"
      class="hn-interactive hn-state-layer hn-press-lg overflow-hidden focus-within:outline-[var(--hn-focus-ring-width)] focus-within:outline-offset-[var(--hn-focus-ring-offset)] focus-within:outline-[var(--hn-focus-ring)]"
    >
      <Ripple />
      <div class="bg-inset grid h-36 place-items-center overflow-hidden px-6" aria-hidden="true">
        <component :is="item.preview" v-if="item.preview" class="pointer-events-none" />
      </div>
      <div class="flex flex-col gap-1 p-5">
        <Heading :level="3" size="md">
          <NuxtLink :to="localePath(item.to)" class="outline-none after:absolute after:inset-0">
            {{ item.label }}
          </NuxtLink>
        </Heading>
        <Text tone="muted" size="sm">{{ t(item.i18n) }}</Text>
      </div>
    </Card>
  </SimpleGrid>
</template>
