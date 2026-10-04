<script setup lang="ts">
  import { Button, Card, NavLink, Page, PageAside, PageBody, PageHeader, Text } from '@hina-ui/vue'
</script>

<template>
  <Card :padded="false" class="w-full overflow-hidden">
    <Page size="lg">
      <PageHeader
        eyebrow="Galgame"
        title="サクラノ詩"
        description="Makura · 2015-10-23 · Written by Sca-ji"
      >
        <template #actions>
          <Button variant="soft" tone="neutral" size="sm">Favourite</Button>
          <Button size="sm">Mark as playing</Button>
        </template>
      </PageHeader>

      <PageBody>
        <Text size="sm" tone="muted">The synopsis and details go here.</Text>
        <Text size="sm" tone="muted">PageBody sets the spacing between sections.</Text>
      </PageBody>

      <template #aside>
        <PageAside label="On this page">
          <NavLink href="#" label="Overview">Overview</NavLink>
          <NavLink href="#" label="Characters">Characters</NavLink>
          <NavLink href="#" label="Staff">Staff</NavLink>
        </PageAside>
      </template>
    </Page>
  </Card>
</template>
