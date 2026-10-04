<script setup lang="ts">
  import { ExternalLink } from '@lucide/vue'
  import { Center, Link, Text } from '@hina-ui/vue'
</script>

<template>
  <Text class="max-w-md">
    This sentence has an
    <Center inline class="gap-1">
      <Link href="#">external link</Link>
      <ExternalLink class="size-3.5" />
    </Center>
    in the middle of it, with the icon aligned to the text.
  </Text>
</template>
