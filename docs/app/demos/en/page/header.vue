<script setup lang="ts">
  import { Button, Card, Inline, Page, PageHeader, Tag } from '@hina-ui/vue'
</script>

<template>
  <Card :padded="false" class="w-full overflow-hidden">
    <Page size="sm">
      <PageHeader
        eyebrow="Light novel"
        title="Spring and Asura"
        description="Three volumes, ongoing."
      >
        <template #actions>
          <Button variant="soft" tone="neutral" size="sm">Favourite</Button>
          <Button size="sm">Start reading</Button>
        </template>

        <Inline gap="xs">
          <Tag>Fantasy</Tag>
          <Tag>School</Tag>
          <Tag tone="accent">Editor's pick</Tag>
        </Inline>
      </PageHeader>
    </Page>
  </Card>
</template>
