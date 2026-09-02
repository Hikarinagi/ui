<script setup lang="ts">
  import { NumberFormat, Stack, Text, enUS, provideUiLocale } from '@hina-ui/vue'
  import { defineComponent, h } from 'vue'

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
      简体中文：
      <NumberFormat :value="1234567" format="compact" />
    </Text>
    <Text>
      English：
      <English><NumberFormat :value="1234567" format="compact" /></English>
    </Text>
  </Stack>
</template>
