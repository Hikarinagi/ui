<script setup lang="ts">
  import { ref } from 'vue'
  import { Listbox } from '@hina-ui/vue'

  const sort = ref('latest')
  const sorts = [
    { value: 'latest', label: '最近更新' },
    {
      label: '按评分',
      options: [
        { value: 'rating-desc', label: '评分从高到低' },
        { value: 'rating-asc', label: '评分从低到高' },
      ],
    },
    {
      label: '按发售',
      options: [
        { value: 'release-desc', label: '最新发售' },
        { value: 'release-asc', label: '最早发售' },
      ],
    },
  ]
</script>

<template>
  <Listbox v-model="sort" :options="sorts" aria-label="排序" class="w-56" />
</template>
