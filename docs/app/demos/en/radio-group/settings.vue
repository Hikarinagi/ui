<script setup lang="ts">
  import { ref } from 'vue'
  import { RadioGroup } from '@hina-ui/vue'

  const visibility = ref('friends')
  const options = [
    { value: 'public', label: 'Public', description: 'Anyone can see this post' },
    {
      value: 'friends',
      label: 'Friends only',
      description: 'Only people you follow back can see it',
    },
    { value: 'private', label: 'Only me', description: 'Only you can see it' },
  ]
</script>

<template>
  <RadioGroup
    v-model="visibility"
    control-placement="end"
    block
    :options="options"
    aria-label="Visibility"
  />
</template>
