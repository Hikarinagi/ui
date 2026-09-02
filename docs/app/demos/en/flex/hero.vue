<script setup lang="ts">
  import { Button, Card, Flex, Heading, Tag } from '@hina-ui/vue'
</script>

<template>
  <Card class="w-full max-w-lg">
    <Flex justify="between" align="center" wrap class="gap-3">
      <Flex direction="col" gap="xs">
        <Heading :level="3" size="md">Beyond the Stars</Heading>
        <Flex gap="xs">
          <Tag>Sci-fi</Tag>
          <Tag>Ongoing</Tag>
        </Flex>
      </Flex>
      <Flex gap="sm">
        <Button variant="soft" tone="neutral">Add to shelf</Button>
        <Button>Read</Button>
      </Flex>
    </Flex>
  </Card>
</template>
