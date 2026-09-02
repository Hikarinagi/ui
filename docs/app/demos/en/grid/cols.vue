<script setup lang="ts">
  import { Card, Grid, Stack, Text } from '@hina-ui/vue'

  const counts = [2, 3, 4, 6] as const
</script>

<template>
  <Stack class="w-full max-w-md">
    <Stack v-for="cols in counts" :key="cols" gap="xs">
      <Text tone="muted" size="sm">cols {{ cols }}</Text>
      <Grid :cols="cols" gap="sm">
        <Card
          v-for="i in cols"
          :key="i"
          class="bg-inset grid h-10 place-items-center text-sm"
          :padded="false"
        >
          {{ i }}
        </Card>
      </Grid>
    </Stack>
  </Stack>
</template>
