<script setup lang="ts">
  import { Alert } from '@hina-ui/vue'

  const { t } = useI18n()
</script>

<template>
  <Alert tone="accent" :title="t('landing.wall.notice.title')" closable class="w-[340px]">
    {{ t('landing.wall.notice.body') }}
  </Alert>
</template>
