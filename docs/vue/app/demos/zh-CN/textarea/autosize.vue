<script setup lang="ts">
  import { ref } from 'vue'
  import { Stack, Textarea } from '@hina-ui/vue'

  const free = ref('')
  const bounded = ref('')
</script>

<template>
  <Stack class="w-full max-w-md">
    <Textarea v-model="free" aria-label="不限行数" autosize placeholder="随内容增高，不限行数" />
    <Textarea
      v-model="bounded"
      aria-label="两到五行"
      :autosize="{ minRows: 2, maxRows: 5 }"
      placeholder="最少两行，最多五行，超出后在框内滚动"
    />
  </Stack>
</template>
