<script setup lang="ts">
  import { ArrowUpRight } from '@lucide/vue'
  import { Button, Inline } from '@hina-ui/vue'
</script>

<template>
  <Inline>
    <Button
      as="a"
      href="https://www.hikarinagi.com"
      target="_blank"
      rel="noreferrer"
      variant="outline"
    >
      Visit Hikarinagi
      <template #trailing>
        <ArrowUpRight />
      </template>
    </Button>
    <Button
      as="a"
      href="https://www.hikarinagi.com"
      target="_blank"
      rel="noreferrer"
      variant="link"
    >
      Learn more
    </Button>
  </Inline>
</template>
