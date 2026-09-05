<script setup lang="ts">
  import { HoverCard, Link, Stack, Text } from '@hina-ui/vue'
</script>

<template>
  <HoverCard>
    <Link href="#">Reka UI</Link>
    <template #content>
      <Stack gap="xs" class="w-64">
        <Text weight="medium">Reka UI</Text>
        <Text tone="muted" size="sm">
          An unstyled, accessible set of Vue primitives that most interactive components in this
          library are built on.
        </Text>
      </Stack>
    </template>
  </HoverCard>
</template>
