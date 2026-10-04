<script setup lang="ts">
  import { ref } from 'vue'
  import { ListFilter } from '@lucide/vue'
  import { Stack, Text, Toggle } from '@hina-ui/vue'

  const onlyDone = ref(false)
</script>

<template>
  <Stack gap="sm" align="start">
    <Toggle v-model="onlyDone">
      <template #icon><ListFilter /></template>
      仅看已完结
    </Toggle>
    <Text tone="muted" size="sm">{{ onlyDone ? '只显示已完结的作品' : '显示全部作品' }}</Text>
  </Stack>
</template>
