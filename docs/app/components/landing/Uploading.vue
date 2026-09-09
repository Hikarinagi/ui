<script setup lang="ts">
  import { Progress } from '@hina-ui/vue'

  const { t } = useI18n()
</script>

<template>
  <Progress :value="62" :label="t('landing.wall.progress.label')" show-value class="w-[256px]" />
</template>
