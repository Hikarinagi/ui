<script setup lang="ts">
  import { ref } from 'vue'
  import { SegmentedControl } from '@hina-ui/vue'

  const sort = ref('relevance')
  const options = [
    { value: 'relevance', label: '综合' },
    { value: 'updated', label: '最近更新' },
    { value: 'favorites', label: '收藏最多' },
    { value: 'comments', label: '评论最多' },
    { value: 'words', label: '字数最多' },
    { value: 'rating', label: '评分最高' },
  ]
</script>

<template>
  <SegmentedControl v-model="sort" :options="options" class="max-w-xs" aria-label="排序" />
</template>
