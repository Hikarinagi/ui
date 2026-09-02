<script setup lang="ts">
  import { BookOpen } from '@lucide/vue'
  import { Button, Card, Center, Heading, Stack, Text } from '@hikarinagi/ui'
</script>

<template>
  <Card class="w-full max-w-md">
    <Center class="h-56">
      <Stack gap="sm" align="center">
        <Center class="bg-inset text-muted size-12 rounded-full">
          <BookOpen class="size-6" />
        </Center>
        <Heading :level="3" size="md">Your shelf is empty</Heading>
        <Text tone="muted" size="sm">Anything you save will show up here.</Text>
        <Button size="sm" variant="soft" tone="neutral">Browse works</Button>
      </Stack>
    </Center>
  </Card>
</template>
