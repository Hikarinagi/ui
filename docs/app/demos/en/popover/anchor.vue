<script setup lang="ts">
  import { ref, shallowRef } from 'vue'
  import { Button, Inline, Popover, Stack, Text } from '@hina-ui/vue'

  const open = ref(false)
  const current = ref(0)
  const anchor = shallowRef<HTMLElement | null>(null)

  function toggle(event: MouseEvent, index: number) {
    const target = event.currentTarget as HTMLElement
    open.value = anchor.value === target ? !open.value : true
    anchor.value = target
    current.value = index
  }
</script>

<template>
  <Inline>
    <Button
      v-for="index in 2"
      :key="index"
      variant="outline"
      tone="neutral"
      aria-haspopup="dialog"
      :aria-expanded="open && current === index"
      @click="toggle($event, index)"
    >
      Anchor {{ index }}
    </Button>
    <Popover v-model:open="open" :anchor="anchor" :modal="false" aria-label="External anchor">
      <template #content>
        <Stack gap="sm" class="w-56">
          <Text size="sm">The default slot is empty. The anchor sets the position.</Text>
          <Button size="sm" variant="soft" tone="neutral" @click="open = false">Close</Button>
        </Stack>
      </template>
    </Popover>
  </Inline>
</template>
