<script setup lang="ts">
  import { Button, ButtonGroup } from '@hina-ui/vue'
</script>

<template>
  <ButtonGroup
    label="排序"
    class="[&>*:first-child]:rounded-s-full [&>*:last-child]:rounded-e-full"
  >
    <Button variant="soft" tone="neutral" class="px-6">最新</Button>
    <Button variant="soft" tone="neutral" class="px-6">最热</Button>
    <Button variant="soft" tone="neutral" class="px-6">评分</Button>
  </ButtonGroup>
</template>
