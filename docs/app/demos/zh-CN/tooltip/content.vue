<script setup lang="ts">
  import { Info, Save } from '@lucide/vue'
  import { IconButton, Inline, Kbd, Tooltip } from '@hikarinagi/ui'
</script>

<template>
  <Inline align="center" class="gap-6">
    <Tooltip>
      <IconButton label="保存" variant="outline" :tooltip="false">
        <Save />
      </IconButton>
      <template #content>
        <Inline align="center" class="gap-1.5">
          保存草稿
          <Kbd>Ctrl S</Kbd>
        </Inline>
      </template>
    </Tooltip>
    <Tooltip content="这段说明比较长，超过气泡的最大宽度之后会自动折成多行，不会一直往外撑。">
      <IconButton label="说明" variant="outline" :tooltip="false">
        <Info />
      </IconButton>
    </Tooltip>
  </Inline>
</template>
