<script setup lang="ts">
  import { SlidersHorizontal } from '@lucide/vue'
  import { Button, Drawer, Input, Stack, Text } from '@hina-ui/vue'
</script>

<template>
  <Drawer title="Filters" description="Only works matching these conditions are shown.">
    <Button variant="outline" tone="neutral">
      <template #icon>
        <SlidersHorizontal />
      </template>
      Filters
    </Button>
    <template #content>
      <Stack gap="sm">
        <Stack gap="xs">
          <Text size="sm">Keyword</Text>
          <Input model-value="observatory" />
        </Stack>
        <Stack gap="xs">
          <Text size="sm">Release year</Text>
          <Input model-value="2024" />
        </Stack>
        <Stack gap="xs">
          <Text size="sm">Producer</Text>
          <Input model-value="Hoshimi Studio" />
        </Stack>
      </Stack>
    </template>
    <template #footer="{ close }">
      <Button variant="soft" tone="neutral" @click="close">Reset</Button>
      <Button @click="close">Apply</Button>
    </template>
  </Drawer>
</template>
