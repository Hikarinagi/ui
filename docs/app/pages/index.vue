<script setup lang="ts">
  import { ArrowRight } from '@lucide/vue'
  import {
    Button,
    Container,
    Divider,
    Heading,
    Inline,
    SimpleGrid,
    Stack,
    Text,
  } from '@hina-ui/vue'
  import { NuxtLink } from '#components'
  import { components } from '~/nav'

  const { t } = useI18n()
  const localePath = useLocalePath()

  const FEATURES = ['modes', 'appearance', 'a11y', 'scaffolding'] as const

  definePageMeta({ layout: 'landing' })

  useHead({
    title: 'Hina UI',
    titleTemplate: '%s',
  })
</script>

<template>
  <Stack gap="none">
    <Container size="xl" class="py-24 sm:py-32 lg:py-40">
      <Stack gap="xl" align="center" class="text-center">
        <Stack gap="md" align="center">
          <Heading :level="1" size="2xl" class="max-w-4xl text-5xl text-balance sm:text-7xl">
            {{ t('landing.title') }}
          </Heading>
          <Text tone="muted" size="xl" class="mt-6 max-w-2xl text-balance">
            {{ t('landing.subtitle', { count: components.length }) }}
          </Text>
        </Stack>
        <Inline gap="lg" class="mt-4">
          <Button :as="NuxtLink" :to="localePath('/guide/installation')" size="lg">
            {{ t('landing.start') }}
          </Button>
          <Button
            :as="NuxtLink"
            :to="localePath('/components')"
            size="lg"
            variant="outline"
            tone="neutral"
          >
            {{ t('landing.browse') }}
            <template #trailing><ArrowRight /></template>
          </Button>
        </Inline>
      </Stack>
    </Container>

    <DocsLandingWall />

    <Container size="xl" class="pt-16 sm:pt-24 lg:pt-32">
      <SimpleGrid min="14rem" gap="xl">
        <Stack v-for="key in FEATURES" :key="key" gap="xs">
          <Text as="h2" weight="medium">{{ t(`landing.features.${key}.title`) }}</Text>
          <Text tone="muted" size="sm">{{ t(`landing.features.${key}.body`) }}</Text>
        </Stack>
      </SimpleGrid>

      <Divider class="mt-16" />

      <Inline justify="between" align="center" class="py-6">
        <DocsWordmark />
        <Text tone="faint" size="sm" weight="medium">{{ t('landing.copyright') }}</Text>
      </Inline>
    </Container>
  </Stack>
</template>
