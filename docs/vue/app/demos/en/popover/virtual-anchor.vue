<script setup lang="ts">
  import { ref, shallowRef, watch } from 'vue'
  import { useRafFn } from '@vueuse/core'
  import {
    Button,
    ScrollArea,
    Inline,
    Stack,
    Text,
    Popover,
    type OverlayAnchor,
  } from '@hina-ui/vue'

  const open = ref(false)
  const surface = ref<InstanceType<typeof Stack>>()
  const anchor = shallowRef<OverlayAnchor | null>(null)
  const x = ref(80)
  const { pause, resume } = useRafFn(
    ({ delta }) => {
      x.value = 80 + ((x.value - 80 + delta / 35) % 120)
    },
    { immediate: false },
  )
  watch(open, value => (value ? resume() : pause()))

  function show() {
    const element = surface.value?.$el as HTMLElement | undefined
    if (!element) return
    anchor.value = {
      contextElement: element,
      getBoundingClientRect: () => {
        const rect = element.getBoundingClientRect()
        return new DOMRect(rect.left + x.value, rect.top + 100, 2, 20)
      },
    }
    open.value = true
  }
</script>

<template>
  <Stack class="w-full">
    <Inline>
      <Button variant="outline" tone="neutral" @click="show">Open</Button>
      <Text size="sm" tone="muted">Scroll down to observe the position update.</Text>
    </Inline>
    <ScrollArea class="h-64 rounded-lg border border-line bg-inset">
      <Stack ref="surface" class="relative h-128 shrink-0">
        <Text
          as="span"
          aria-hidden="true"
          class="absolute top-25 h-5 w-0.5 bg-accent"
          :style="{ left: `${x}px` }"
        />
      </Stack>
    </ScrollArea>
    <Popover
      v-model:open="open"
      :anchor="anchor"
      update-position-strategy="always"
      align="start"
      :modal="false"
      @open-auto-focus.prevent
    >
      <template #content>
        <Text size="sm">Moving coordinates</Text>
      </template>
    </Popover>
  </Stack>
</template>
