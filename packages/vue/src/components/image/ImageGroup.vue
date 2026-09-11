<script setup lang="ts">
  import Lightbox from '../lightbox/Lightbox.vue'
  import { useImageGroupState } from './composables/useImageGroupState'

  defineOptions({ name: 'HnImageGroup' })

  const props = defineProps<{ loop?: boolean }>()

  const { items, open, index } = useImageGroupState()
</script>

<template>
  <slot />
  <Lightbox v-model:open="open" v-model:index="index" :items="items" :loop="props.loop" />
</template>
