<script setup lang="ts">
  import { Button, IconButton, NumberFormat, VisuallyHidden } from '@hina-ui/vue'
  import { siGithub } from 'simple-icons'
  import BrandIcon from '~/components/docs/BrandIcon'

  defineOptions({ name: 'DocsGithub' })

  const repo = 'Hikarinagi/ui'
  const href = `https://github.com/${repo}`
  const api = `https://api.github.com/repos/${repo}`
  const cacheKey = 'hn-docs-stars'
  const day = 86_400_000
  const { t } = useI18n()

  const { data: built } = await useFetch(api, {
    key: 'github-stars',
    transform: (payload: { stargazers_count: number }) => payload.stargazers_count,
  })

  const fresh = ref<number>()
  const count = computed(() => fresh.value ?? built.value ?? undefined)

  function cached() {
    try {
      const raw = localStorage.getItem(cacheKey)
      if (!raw) return undefined
      const { value, time } = JSON.parse(raw) as { value: number; time: number }
      return Date.now() - time < day ? value : undefined
    } catch {
      return undefined
    }
  }

  function remember(value: number) {
    try {
      localStorage.setItem(cacheKey, JSON.stringify({ value, time: Date.now() }))
    } catch {
      return
    }
  }

  onMounted(async () => {
    const stored = cached()
    if (stored !== undefined) {
      fresh.value = stored
      return
    }
    try {
      const payload = await $fetch<{ stargazers_count: number }>(api)
      fresh.value = payload.stargazers_count
      remember(payload.stargazers_count)
    } catch {
      return
    }
  })
</script>

<template>
  <Button
    as="a"
    :href="href"
    target="_blank"
    rel="noreferrer"
    variant="ghost"
    tone="neutral"
    size="sm"
    class="max-md:hidden"
  >
    <template #icon><BrandIcon :icon="siGithub" /></template>
    <VisuallyHidden>{{ t('nav.github') }}</VisuallyHidden>
    <NumberFormat v-if="count !== undefined" :value="count" format="compact" :precision="1" />
  </Button>
  <IconButton
    as="a"
    :href="href"
    target="_blank"
    rel="noreferrer"
    size="sm"
    :label="t('nav.github')"
    :tooltip="false"
    class="md:hidden"
  >
    <BrandIcon :icon="siGithub" />
  </IconButton>
</template>
