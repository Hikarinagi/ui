<script setup lang="ts">
  import { computed, reactive, shallowRef } from 'vue'
  import Lightbox from '../lightbox/Lightbox.vue'
  import type { LightboxItem } from '../lightbox/types'
  import { provideImageGroup } from './context'

  defineOptions({ name: 'HnImageGroup' })

  const props = defineProps<{ loop?: boolean }>()

  const registry = reactive(new Map<string, () => LightboxItem>())
  const open = shallowRef(false)
  const index = shallowRef(0)

  function byDom(a: LightboxItem, b: LightboxItem): number {
    const first = a.source?.()
    const second = b.source?.()
    if (!first || !second || first === second) return 0
    return first.compareDocumentPosition(second) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
  }

  const items = computed(() => [...registry.values()].map(read => read()).sort(byDom))

  provideImageGroup({
    register: (id, item) => {
      registry.set(id, item)
    },
    unregister: id => {
      registry.delete(id)
    },
    open: id => {
      const at = items.value.findIndex(item => item.id === id)
      if (at < 0) return
      index.value = at
      open.value = true
    },
  })
</script>

<template>
  <slot />
  <Lightbox v-model:open="open" v-model:index="index" :items="items" :loop="props.loop" />
</template>
