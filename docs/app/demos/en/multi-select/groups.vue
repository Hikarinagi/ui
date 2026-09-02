<script setup lang="ts">
  import { ref } from 'vue'
  import { MultiSelect } from '@hina-ui/vue'

  const languages = ref(['zh'])
  const options = [
    { value: 'zh', label: 'Simplified Chinese' },
    {
      label: 'Japanese',
      options: [
        { value: 'ja', label: 'Japanese original' },
        { value: 'ja-tl', label: 'Japanese with translation' },
      ],
    },
    {
      label: 'Others',
      options: [
        { value: 'en', label: 'English' },
        { value: 'ko', label: 'Korean' },
      ],
    },
  ]
</script>

<template>
  <MultiSelect v-model="languages" :options="options" aria-label="Languages" class="w-72" />
</template>
