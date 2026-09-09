<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { Select } from '@hina-ui/vue'

  const { t } = useI18n()
  const by = ref('score')
  const options = computed(() =>
    ['date', 'score', 'saves'].map(value => ({ value, label: t(`landing.wall.sort.${value}`) })),
  )
</script>

<template>
  <Select
    v-model="by"
    :options="options"
    :aria-label="t('landing.wall.sort.label')"
    class="w-[256px]"
  />
</template>
