<script setup lang="ts">
  import { ref } from 'vue'
  import { useRipple } from './useRipple'

  defineOptions({ name: 'HnRipple' })

  const props = defineProps<{ disabled?: boolean }>()

  const container = ref<HTMLElement | null>(null)
  const surface = ref<HTMLElement | null>(null)

  const { pressed } = useRipple(container, surface, () => !!props.disabled)
</script>

<template>
  <div ref="container" aria-hidden="true" class="hn-ripple">
    <div ref="surface" class="hn-ripple-surface" :data-pressed="pressed ? '' : undefined"></div>
  </div>
</template>
