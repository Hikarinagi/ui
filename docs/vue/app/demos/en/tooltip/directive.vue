<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, Inline, Input, Stack, Switch, Text, vTooltip } from '@hina-ui/vue'

  const content = ref('Tooltip text')
  const disabled = ref(false)
</script>

<template>
  <Stack align="start">
    <Inline>
      <Button v-tooltip="'Bound to the existing element'" variant="outline" tone="neutral">
        String
      </Button>
      <Button v-tooltip="{ content, side: 'bottom', disabled }" variant="outline" tone="neutral">
        Options
      </Button>
    </Inline>
    <Input v-model="content" aria-label="Tooltip text" class="w-64" />
    <Inline>
      <Switch v-model="disabled" aria-label="Disable configured tooltip" />
      <Text>Disable configured tooltip</Text>
    </Inline>
  </Stack>
</template>
