<script setup lang="ts">
  import { onBeforeUnmount, onMounted, ref, watch, type Component } from 'vue'
  import { Center } from '@hina-ui/vue'

  defineOptions({ name: 'DocsCategoryPreview' })

  const props = defineProps<{ preview?: Component }>()

  const STAGE_WIDTH = 640
  const INSET = 24

  const box = ref<{ $el: HTMLElement } | null>(null)
  const stage = ref<{ $el: HTMLElement } | null>(null)
  const scale = ref(1)

  function measure() {
    const boxEl = box.value?.$el
    const stageEl = stage.value?.$el
    if (!boxEl || !stageEl) return
    const kids = [...stageEl.children] as HTMLElement[]
    const width = Math.max(0, ...kids.map(el => el.offsetWidth))
    const height = stageEl.offsetHeight
    scale.value = Math.min(
      1,
      width ? (boxEl.clientWidth - INSET) / width : 1,
      height ? (boxEl.clientHeight - INSET) / height : 1,
    )
  }

  let ro: ResizeObserver | undefined

  onMounted(() => {
    ro = new ResizeObserver(measure)
    if (box.value?.$el) ro.observe(box.value.$el)
    if (stage.value?.$el) ro.observe(stage.value.$el)
    measure()
  })

  watch(() => props.preview, measure, { flush: 'post' })

  onBeforeUnmount(() => ro?.disconnect())
</script>

<template>
  <Center ref="box" class="bg-inset h-48 overflow-hidden" aria-hidden="true">
    <Center
      ref="stage"
      :style="{ width: `${STAGE_WIDTH}px`, transform: `scale(${scale})` }"
      class="pointer-events-none shrink-0"
    >
      <component :is="props.preview" v-if="props.preview" />
    </Center>
  </Center>
</template>
