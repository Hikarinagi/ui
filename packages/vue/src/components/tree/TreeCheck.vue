<script setup lang="ts">
  import { Check, Minus } from '@lucide/vue'
  import { checkboxBox } from '../checkbox/checkbox.variants'

  defineOptions({ name: 'HnTreeCheck' })
  const props = defineProps<{ selected: boolean; indeterminate: boolean }>()
</script>

<template>
  <span
    aria-hidden="true"
    :data-state="props.indeterminate ? 'indeterminate' : props.selected ? 'checked' : 'unchecked'"
    :class="checkboxBox()"
    class="pointer-events-none"
  >
    <Transition
      enter-active-class="hn-transition-press"
      enter-from-class="scale-50 opacity-0"
      leave-active-class="hn-transition"
      leave-to-class="scale-50 opacity-0"
    >
      <Check v-if="props.selected" />
    </Transition>
    <Transition
      enter-active-class="hn-transition-press"
      enter-from-class="scale-50 opacity-0"
      leave-active-class="hn-transition"
      leave-to-class="scale-50 opacity-0"
    >
      <Minus v-if="props.indeterminate" />
    </Transition>
  </span>
</template>
