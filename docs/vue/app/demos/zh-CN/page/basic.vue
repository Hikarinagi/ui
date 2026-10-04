<script setup lang="ts">
  import { Card, Page, PageBody, PageHeader, Text } from '@hina-ui/vue'
</script>

<template>
  <Card :padded="false" class="w-full overflow-hidden">
    <Page size="sm">
      <PageHeader title="我的书架" description="收录了 48 部作品。" />
      <PageBody>
        <Text size="sm" tone="muted">页面正文。</Text>
      </PageBody>
    </Page>
  </Card>
</template>
