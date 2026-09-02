<script setup lang="ts">
  import { Card, NavLink, Page, PageAside, PageBody, PageHeader, Text } from '@hina-ui/vue'
</script>

<template>
  <Card :padded="false" class="w-full overflow-hidden">
    <Page size="lg">
      <PageHeader title="制作人员" />
      <PageBody>
        <Text size="sm" tone="muted">主栏内容。侧栏在视口窄于 1280 像素时不显示。</Text>
      </PageBody>

      <template #aside>
        <PageAside label="相关条目">
          <NavLink href="#" label="同社作品">同社作品</NavLink>
          <NavLink href="#" label="同一剧本">同一剧本</NavLink>
        </PageAside>
      </template>
    </Page>
  </Card>
</template>
