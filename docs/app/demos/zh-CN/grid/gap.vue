<script setup lang="ts">
  import { Card, Grid, Stack, Text } from '@hikarinagi/ui'
</script>

<template>
  <Stack class="w-full max-w-md">
    <Stack gap="xs">
      <Text tone="muted" size="sm">md 档：列间 12 像素，行间 16 像素</Text>
      <Grid :cols="3" gap="md">
        <Card v-for="i in 6" :key="i" class="bg-inset h-10" :padded="false" />
      </Grid>
    </Stack>
    <Stack gap="xs">
      <Text tone="muted" size="sm">其余档位两轴相同，这里是 lg 的 24 像素</Text>
      <Grid :cols="3" gap="lg">
        <Card v-for="i in 6" :key="i" class="bg-inset h-10" :padded="false" />
      </Grid>
    </Stack>
  </Stack>
</template>
