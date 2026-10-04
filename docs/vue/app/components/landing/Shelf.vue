<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { SegmentedControl } from '@hina-ui/vue'

  const { t } = useI18n()
  const status = ref('ongoing')
  const options = computed(() =>
    ['all', 'ongoing', 'done'].map(value => ({ value, label: t(`landing.wall.shelf.${value}`) })),
  )
</script>

<template>
  <SegmentedControl
    v-model="status"
    :options="options"
    :aria-label="t('landing.wall.shelf.label')"
  />
</template>
