<script setup lang="ts">
  import { Info, Save } from '@lucide/vue'
  import { IconButton, Inline, Kbd, Tooltip } from '@hikarinagi/ui'
</script>

<template>
  <Inline align="center" class="gap-6">
    <Tooltip>
      <IconButton label="Save" variant="outline" :tooltip="false">
        <Save />
      </IconButton>
      <template #content>
        <Inline align="center" class="gap-1.5">
          Save draft
          <Kbd>Ctrl S</Kbd>
        </Inline>
      </template>
    </Tooltip>
    <Tooltip
      content="A note this long runs past the maximum width of the bubble, so it wraps onto several lines instead of stretching out."
    >
      <IconButton label="Notes" variant="outline" :tooltip="false">
        <Info />
      </IconButton>
    </Tooltip>
  </Inline>
</template>
