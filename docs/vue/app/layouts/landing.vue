<script setup lang="ts">
  import { AppShell, Toaster } from '@hina-ui/vue'
</script>

<template>
  <AppShell restore-key="landing">
    <template #banner>
      <DocsBanner />
    </template>
    <template #header>
      <DocsHeader />
    </template>
    <slot />
    <Toaster />
  </AppShell>
</template>
