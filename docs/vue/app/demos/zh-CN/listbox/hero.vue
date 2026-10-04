<script setup lang="ts">
  import { ref } from 'vue'
  import { Listbox } from '@hina-ui/vue'

  const status = ref('doing')
  const statuses = [
    { value: 'wish', label: '想看' },
    { value: 'doing', label: '在看' },
    { value: 'done', label: '看过' },
    { value: 'dropped', label: '抛弃' },
  ]
</script>

<template>
  <Listbox v-model="status" :options="statuses" aria-label="收藏状态" class="w-56" />
</template>
