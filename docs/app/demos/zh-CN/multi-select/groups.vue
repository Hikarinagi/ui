<script setup lang="ts">
  import { ref } from 'vue'
  import { MultiSelect } from '@hina-ui/vue'

  const languages = ref(['zh'])
  const options = [
    { value: 'zh', label: '简体中文' },
    {
      label: '日文',
      options: [
        { value: 'ja', label: '日文原版' },
        { value: 'ja-tl', label: '日文（附翻译）' },
      ],
    },
    {
      label: '其他',
      options: [
        { value: 'en', label: '英文' },
        { value: 'ko', label: '韩文' },
      ],
    },
  ]
</script>

<template>
  <MultiSelect v-model="languages" :options="options" aria-label="语言" class="w-72" />
</template>
