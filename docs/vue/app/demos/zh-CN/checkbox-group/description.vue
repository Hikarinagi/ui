<script setup lang="ts">
  import { ref } from 'vue'
  import { CheckboxGroup } from '@hina-ui/vue'

  const scopes = ref(['read'])
  const options = [
    { value: 'read', label: '读取', description: '查看收藏与阅读进度' },
    { value: 'write', label: '写入', description: '修改收藏与评分' },
    { value: 'admin', label: '管理', description: '管理令牌与授权范围' },
  ]
</script>

<template>
  <CheckboxGroup v-model="scopes" :options="options" aria-label="授权范围" />
</template>
