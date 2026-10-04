<script setup lang="ts">
  import { ref } from 'vue'
  import { CheckboxGroup } from '@hina-ui/vue'

  const types = ref(['gal', 'ln'])
  const options = [
    { value: 'gal', label: 'Galgame' },
    { value: 'ln', label: '轻小说' },
    { value: 'manga', label: '漫画' },
  ]
</script>

<template>
  <CheckboxGroup v-model="types" :options="options" aria-label="作品类型" />
</template>
