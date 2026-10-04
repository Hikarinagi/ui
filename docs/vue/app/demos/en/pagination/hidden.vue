<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, Pagination, Stack, Text } from '@hina-ui/vue'

  const total = ref(5)
</script>

<template>
  <Stack gap="sm">
    <Button variant="soft" tone="neutral" class="self-start" @click="total = total === 5 ? 50 : 5">
      total: {{ total }}
    </Button>
    <Pagination :total="total" hide-single-page>
      <template #list>
        <Text size="sm" tone="muted">The list slot remains mounted.</Text>
      </template>
    </Pagination>
  </Stack>
</template>
