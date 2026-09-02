<script setup lang="ts">
  import { ImageOff } from '@lucide/vue'
  import { Center, Image, Inline, Stack, Text } from '@hina-ui/vue'
</script>

<template>
  <Inline align="start" class="gap-4">
    <Stack gap="xs" class="w-40">
      <Text tone="muted" size="sm">Loaded</Text>
      <Image src="/sample.webp" alt="A slope on a summer afternoon" :ratio="1" class="rounded-md" />
    </Stack>
    <Stack gap="xs" class="w-40">
      <Text tone="muted" size="sm">No source</Text>
      <Image :ratio="1" class="bg-inset rounded-md">
        <template #empty>
          <Center class="text-muted size-full">
            <ImageOff class="size-6" />
          </Center>
        </template>
      </Image>
    </Stack>
    <Stack gap="xs" class="w-40">
      <Text tone="muted" size="sm">Failed</Text>
      <Image src="/missing.webp" alt="" :ratio="1" class="bg-inset rounded-md">
        <template #error>
          <Center class="text-muted size-full">
            <Text size="sm">Unavailable</Text>
          </Center>
        </template>
      </Image>
    </Stack>
  </Inline>
</template>
