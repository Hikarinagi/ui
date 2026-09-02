<script setup lang="ts">
  import { computed } from 'vue'
  import { NuxtLink } from '#components'
  import { Link, Section, SimpleGrid, Stack, Text } from '@hina-ui/vue'
  import { categories, components } from '~/nav'

  defineOptions({ name: 'DocsComponentsOverview' })

  const { t } = useI18n()
  const localePath = useLocalePath()

  const groups = computed(() =>
    categories
      .map(category => ({
        slug: category.slug,
        items: components.filter(item => item.category === category.slug),
      }))
      .filter(group => group.items.length > 0),
  )
</script>

<template>
  <Stack gap="xl">
    <Section
      v-for="group in groups"
      :id="group.slug"
      :key="group.slug"
      :title="t(`categories.${group.slug}.label`)"
    >
      <Text tone="muted">{{ t(`categories.${group.slug}.description`) }}</Text>
      <SimpleGrid min="14rem" gap="md">
        <Stack v-for="item in group.items" :key="item.to" gap="none">
          <Link :as="NuxtLink" :to="localePath(item.to)">{{ item.label }}</Link>
          <Text tone="muted" size="sm">{{ t(item.i18n) }}</Text>
        </Stack>
      </SimpleGrid>
    </Section>
  </Stack>
</template>
