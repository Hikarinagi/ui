<script setup lang="ts">
  import { ref, shallowRef } from 'vue'
  import { Button, HoverCard, Inline, Stack, Text } from '@hina-ui/vue'

  const open = ref(false)
  const anchor = shallowRef<HTMLElement | null>(null)
  const current = ref(1)
  const moving = ref(false)

  function show(event: PointerEvent | FocusEvent, index: number) {
    const target = event.currentTarget as HTMLElement
    if ('pointerType' in event ? event.pointerType === 'touch' : !target.matches(':focus-visible'))
      return
    if (!open.value) moving.value = false
    else if (anchor.value !== target) moving.value = true
    anchor.value = target
    current.value = index
    open.value = true
  }
</script>

<template>
  <Inline>
    <Button
      v-for="index in 3"
      :key="index"
      variant="outline"
      tone="neutral"
      @pointerenter="show($event, index)"
      @focus="show($event, index)"
    >
      Anchor {{ index }}
    </Button>
    <HoverCard
      v-model:open="open"
      :anchor="anchor"
      :positioner-class="
        open && moving ? 'hn-transition-base motion-reduce:transition-none' : undefined
      "
    >
      <template #content>
        <Stack gap="xs" class="w-56">
          <Text weight="medium">Anchor {{ current }}</Text>
          <Text tone="muted" size="sm">One card moves smoothly to the active anchor.</Text>
        </Stack>
      </template>
    </HoverCard>
  </Inline>
</template>
