<script setup lang="ts">
  import { provideUiLocale, enUS, zhCN } from '@hina-ui/vue'

  const { locale } = useI18n()

  provideUiLocale(() => (locale.value === 'en' ? enUS : zhCN))

  useHead(useLocaleHead())
</script>

<template>
  <NuxtLoadingIndicator color="var(--hn-accent)" :height="2" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
