<script setup lang="ts">
  import { Card, Image, LoadingOverlay, Stack, Text } from '@hina-ui/vue'
</script>

<template>
  <Card class="relative h-56 w-96">
    <Text>The shelf is being tidied.</Text>
    <LoadingOverlay visible :delay="0">
      <Stack gap="xs" align="center" role="status">
        <Image
          src="/mascot/run.gif"
          alt="Hoshimi Shion running over with a book"
          :ratio="1"
          fit="contain"
          :skeleton="false"
          eager
          :lazy="false"
          class="size-28"
        />
        <Text size="sm" tone="muted">Shion is tidying the shelf, one moment.</Text>
      </Stack>
    </LoadingOverlay>
  </Card>
</template>
