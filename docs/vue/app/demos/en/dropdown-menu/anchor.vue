<script setup lang="ts">
  import { ref, shallowRef } from 'vue'
  import { Button, DropdownMenu, DropdownMenuItem, Inline } from '@hina-ui/vue'

  const open = ref(false)
  const current = ref(0)
  const anchor = shallowRef<HTMLElement | null>(null)

  function toggle(event: MouseEvent | KeyboardEvent, index: number) {
    const target = event.currentTarget as HTMLElement
    open.value = event.type === 'keydown' || anchor.value !== target || !open.value
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
      aria-haspopup="menu"
      :aria-expanded="open && current === index"
      @click="toggle($event, index)"
      @keydown.down.prevent="toggle($event, index)"
    >
      Anchor {{ index }}
    </Button>
    <DropdownMenu v-model:open="open" :anchor="anchor" :modal="false" label="External menu">
      <template #content>
        <DropdownMenuItem>Copy</DropdownMenuItem>
        <DropdownMenuItem>Rename</DropdownMenuItem>
        <DropdownMenuItem disabled>Unavailable</DropdownMenuItem>
      </template>
    </DropdownMenu>
  </Inline>
</template>
