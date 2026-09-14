<script setup lang="ts">
  import { ref, shallowRef, watch } from 'vue'
  import { useRafFn } from '@vueuse/core'
  import {
    Button,
    ScrollArea,
    Inline,
    Stack,
    Text,
    DropdownMenu,
    DropdownMenuItem,
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
      <Button variant="outline" tone="neutral" @click="show">打开</Button>
      <Text size="sm" tone="muted">向下滚动可观察定位变化。</Text>
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
    <DropdownMenu
      v-model:open="open"
      :anchor="anchor"
      update-position-strategy="always"
      align="start"
      :modal="false"
    >
      <template #content>
        <DropdownMenuItem>第一项</DropdownMenuItem>
        <DropdownMenuItem>第二项</DropdownMenuItem>
      </template>
    </DropdownMenu>
  </Stack>
</template>
