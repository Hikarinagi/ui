<script setup lang="ts">
  import { Button, Card, Heading, Input, Stack, Text } from '@hina-ui/vue'
</script>

<template>
  <Card class="w-full max-w-sm">
    <Stack>
      <Stack gap="xs">
        <Heading :level="3" size="md">Create a list</Heading>
        <Text tone="muted" size="sm">Works can be added to it at any time.</Text>
      </Stack>
      <Stack gap="xs">
        <Text size="sm">Name</Text>
        <Input model-value="Light novels I read this year" />
      </Stack>
      <Button>Create</Button>
    </Stack>
  </Card>
</template>
