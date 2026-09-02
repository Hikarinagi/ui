<script setup lang="ts">
  import { Card, Section, Tag, Inline, Text } from '@hina-ui/vue'
</script>

<template>
  <Card class="w-full">
    <Section>
      <Inline gap="xs">
        <Tag>Fantasy</Tag>
        <Tag>School</Tag>
      </Inline>
      <Text size="sm" tone="muted">
        Without a title, no heading is rendered — only the grouping and spacing remain.
      </Text>
    </Section>
  </Card>
</template>
