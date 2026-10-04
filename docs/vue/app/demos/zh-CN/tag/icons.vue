<script setup lang="ts">
  import { Check, CircleAlert, Clock } from '@lucide/vue'
  import { Inline, Tag } from '@hina-ui/vue'
</script>

<template>
  <Inline align="center">
    <Tag tone="success">
      <Check />
      已通过
    </Tag>
    <Tag tone="warning">
      <Clock />
      待复核
    </Tag>
    <Tag tone="danger" variant="outline">
      <CircleAlert />
      已驳回
    </Tag>
  </Inline>
</template>
