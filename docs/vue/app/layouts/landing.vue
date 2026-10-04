<script setup lang="ts">
  import { AppShell, Toaster } from '@hina-ui/vue'

  const shell = shallowRef<InstanceType<typeof AppShell>>()
  useScrollRestore('landing', () => shell.value?.mainArea)
</script>

<template>
  <AppShell ref="shell" restore-key="landing">
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
