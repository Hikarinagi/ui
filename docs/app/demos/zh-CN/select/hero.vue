<script setup lang="ts">
  import { ref } from 'vue'
  import { Select } from '@hina-ui/vue'

  const type = ref('gal')
  const types = [
    { value: 'gal', label: 'Galgame' },
    { value: 'ln', label: '轻小说' },
    { value: 'manga', label: '漫画' },
    { value: 'anime', label: '动画' },
  ]
</script>

<template>
  <Select v-model="type" :options="types" aria-label="作品类型" class="w-64" />
</template>
