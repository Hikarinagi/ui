<script setup lang="ts">
  import { Stack, Text, Time, enUS, provideUiLocale } from '@hikarinagi/ui'
  import { defineComponent, h } from 'vue'

  const value = '2026-03-14T09:30:00+08:00'

  const English = defineComponent({
    setup(_, { slots }) {
      provideUiLocale(enUS)
      return () => h('span', slots.default?.())
    },
  })
</script>

<template>
  <Stack class="max-w-sm">
    <Text>
      Site language:
      <Time :value="value" />
    </Text>
    <Text>
      English:
      <English><Time :value="value" /></English>
    </Text>
  </Stack>
</template>
