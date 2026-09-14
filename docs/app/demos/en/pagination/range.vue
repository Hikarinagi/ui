<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, Inline, Pagination, Stack, Text } from '@hina-ui/vue'

  const page = ref(18)
  const total = ref(200)
  const pageSize = ref(10)
</script>

<template>
  <Stack gap="sm">
    <Inline gap="sm">
      <Button variant="soft" tone="neutral" @click="total = total === 200 ? 45 : 200">
        total: {{ total }}
      </Button>
      <Button variant="soft" tone="neutral" @click="pageSize = pageSize === 10 ? 25 : 10">
        page-size: {{ pageSize }}
      </Button>
    </Inline>
    <Pagination v-model="page" :total="total" :page-size="pageSize" />
    <Text size="sm" tone="muted">Page: {{ page }}</Text>
  </Stack>
</template>
