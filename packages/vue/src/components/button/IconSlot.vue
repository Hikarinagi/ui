<script setup lang="ts">
  import Spinner from '../spinner/Spinner.vue'

  defineOptions({ name: 'HnButtonIconSlot' })

  const props = defineProps<{
    boxClass: string
    swapped: boolean
    spinnerSize: 'sm' | 'md'
  }>()
</script>

<template>
  <span :class="props.boxClass">
    <span
      class="hn-transition inline-flex items-center justify-center"
      :class="props.swapped ? 'scale-90 opacity-0' : 'scale-100 opacity-100'"
    >
      <slot />
    </span>
    <Transition
      enter-active-class="hn-transition-base"
      enter-from-class="scale-90 opacity-0"
      leave-active-class="hn-transition"
      leave-to-class="scale-90 opacity-0"
    >
      <span
        v-if="props.swapped"
        aria-hidden="true"
        class="absolute inset-0 inline-flex items-center justify-center"
      >
        <Spinner :size="props.spinnerSize" />
      </span>
    </Transition>
  </span>
</template>
