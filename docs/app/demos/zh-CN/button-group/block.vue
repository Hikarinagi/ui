<script setup lang="ts">
  import { Button, ButtonGroup } from '@hina-ui/vue'
</script>

<template>
  <ButtonGroup label="投票" block>
    <Button variant="outline" tone="neutral">赞成</Button>
    <Button variant="outline" tone="neutral">弃权</Button>
    <Button variant="outline" tone="neutral">反对</Button>
  </ButtonGroup>
</template>
