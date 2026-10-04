<script setup lang="ts">
  import { ref } from 'vue'
  import { Combobox } from '@hina-ui/vue'

  const tag = ref<string | null>(null)
  const tags = [
    {
      label: 'Theme',
      options: [
        { value: 'school', label: 'School' },
        { value: 'sf', label: 'Sci-fi' },
        { value: 'fantasy', label: 'Fantasy' },
      ],
    },
    {
      label: 'Form',
      options: [
        { value: 'kinetic', label: 'Kinetic' },
        { value: 'branch', label: 'Branching' },
      ],
    },
  ]
</script>

<template>
  <Combobox
    v-model="tag"
    :options="tags"
    placeholder="Search tags"
    aria-label="Tags"
    class="w-64"
  />
</template>
