<script setup lang="ts">
  import { Check, CircleAlert, Clock } from '@lucide/vue'
  import { Inline, Tag } from '@hikarinagi/ui'
</script>

<template>
  <Inline align="center">
    <Tag tone="success">
      <Check />
      Approved
    </Tag>
    <Tag tone="warning">
      <Clock />
      In review
    </Tag>
    <Tag tone="danger" variant="outline">
      <CircleAlert />
      Rejected
    </Tag>
  </Inline>
</template>
