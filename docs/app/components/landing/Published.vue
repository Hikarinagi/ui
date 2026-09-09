<script setup lang="ts">
  import { Button, Result } from '@hina-ui/vue'

  const { t } = useI18n()
</script>

<template>
  <Result
    status="success"
    :title="t('landing.wall.published.title')"
    :description="t('landing.wall.published.body')"
    class="w-[300px]"
  >
    <template #actions>
      <Button size="sm">{{ t('landing.wall.published.view') }}</Button>
      <Button size="sm" variant="ghost" tone="neutral">
        {{ t('landing.wall.published.back') }}
      </Button>
    </template>
  </Result>
</template>
