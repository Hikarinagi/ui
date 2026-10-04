<script setup lang="ts">
  import { Button, Card, Divider, Heading, Inline, Stack, Tag, Text } from '@hina-ui/vue'
</script>

<template>
  <Card class="w-full max-w-sm">
    <Stack>
      <Stack gap="xs">
        <Inline justify="between" align="start" :wrap="false">
          <Heading :level="3" size="md">Sakura no Uta</Heading>
          <Tag tone="success">Ongoing</Tag>
        </Inline>
        <Text tone="muted" size="sm">
          On my first day at the new school, I met a girl on the roof holding an old camera.
        </Text>
      </Stack>
      <Divider />
      <Inline justify="between">
        <Text tone="faint" size="sm">12 volumes</Text>
        <Button variant="ghost" tone="neutral" size="sm">Open</Button>
      </Inline>
    </Stack>
  </Card>
</template>
