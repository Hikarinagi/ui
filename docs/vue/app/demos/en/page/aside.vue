<script setup lang="ts">
  import { Card, NavLink, Page, PageAside, PageBody, PageHeader, Text } from '@hina-ui/vue'
</script>

<template>
  <Card :padded="false" class="w-full overflow-hidden">
    <Page size="lg">
      <PageHeader title="Staff" />
      <PageBody>
        <Text size="sm" tone="muted">
          Main column. The aside is hidden below a viewport width of 1280 pixels.
        </Text>
      </PageBody>

      <template #aside>
        <PageAside label="Related">
          <NavLink href="#" label="Same brand">Same brand</NavLink>
          <NavLink href="#" label="Same writer">Same writer</NavLink>
        </PageAside>
      </template>
    </Page>
  </Card>
</template>
