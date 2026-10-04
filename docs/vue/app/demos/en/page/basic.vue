<script setup lang="ts">
  import { Card, Page, PageBody, PageHeader, Text } from '@hina-ui/vue'
</script>

<template>
  <Card :padded="false" class="w-full overflow-hidden">
    <Page size="sm">
      <PageHeader title="My shelf" description="48 titles collected." />
      <PageBody>
        <Text size="sm" tone="muted">Page content.</Text>
      </PageBody>
    </Page>
  </Card>
</template>
