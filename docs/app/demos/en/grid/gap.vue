<script setup lang="ts">
  import { Card, Grid, Stack, Text } from '@hikarinagi/ui'
</script>

<template>
  <Stack class="w-full max-w-md">
    <Stack gap="xs">
      <Text tone="muted" size="sm">At md: 12 pixels between columns, 16 between rows</Text>
      <Grid :cols="3" gap="md">
        <Card v-for="i in 6" :key="i" class="bg-emphasis h-10" :padded="false" />
      </Grid>
    </Stack>
    <Stack gap="xs">
      <Text tone="muted" size="sm">Every other step is the same on both axes, here lg at 24</Text>
      <Grid :cols="3" gap="lg">
        <Card v-for="i in 6" :key="i" class="bg-emphasis h-10" :padded="false" />
      </Grid>
    </Stack>
  </Stack>
</template>
