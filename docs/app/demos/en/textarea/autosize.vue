<script setup lang="ts">
  import { ref } from 'vue'
  import { Stack, Textarea } from '@hina-ui/vue'

  const free = ref('')
  const bounded = ref('')
</script>

<template>
  <Stack class="w-full max-w-md">
    <Textarea
      v-model="free"
      aria-label="Unbounded"
      autosize
      placeholder="Grows with the content, no limit"
    />
    <Textarea
      v-model="bounded"
      aria-label="Two to five rows"
      :autosize="{ minRows: 2, maxRows: 5 }"
      placeholder="Starts at two rows, stops at five, then scrolls inside"
    />
  </Stack>
</template>
