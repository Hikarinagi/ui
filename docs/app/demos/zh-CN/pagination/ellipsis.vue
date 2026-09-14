<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, Pagination, Stack, Text } from '@hina-ui/vue'

  const page = ref(10)
  const large = ref(false)
</script>

<template>
  <Stack gap="sm">
    <Pagination v-model="page" :total="large ? 100000 : 250" />
    <Text size="sm" tone="muted">当前页: {{ page }}</Text>
    <Button variant="soft" tone="neutral" class="self-start" @click="large = !large">
      {{ large ? '25 页' : '10,000 页' }}
    </Button>
  </Stack>
</template>
