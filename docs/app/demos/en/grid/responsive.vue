<script setup lang="ts">
  import { Card, Grid, Stack, Text } from '@hikarinagi/ui'
</script>

<template>
  <Stack gap="sm" class="w-full max-w-2xl">
    <Text tone="muted" size="sm">Two columns on a narrow screen, four on a wide one</Text>
    <Grid :cols="2" class="sm:grid-cols-4">
      <Card v-for="i in 8" :key="i" class="bg-inset h-12" :padded="false" />
    </Grid>
  </Stack>
</template>
