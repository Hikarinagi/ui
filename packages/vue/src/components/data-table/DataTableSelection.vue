<script setup lang="ts">
  import Checkbox from '../checkbox/Checkbox.vue'
  import { checkboxBox } from '../checkbox/checkbox.variants'
  import { radioDot } from '../radio-group/radio-group.variants'
  defineProps<{
    single?: boolean
    checked: boolean | 'indeterminate'
    disabled?: boolean
    label: string
    name: string
  }>()
  defineEmits<{ change: [value: boolean] }>()
</script>
<template>
  <label v-if="single" class="relative inline-grid" :class="disabled && 'opacity-50'">
    <input
      type="radio"
      :name="name"
      :checked="checked === true"
      :disabled="disabled"
      :aria-label="label"
      class="peer absolute inset-0 z-10 size-full cursor-pointer opacity-0"
      @change="$emit('change', true)"
    />
    <span
      aria-hidden="true"
      :class="[
        checkboxBox({ shape: 'round' }),
        'peer-focus-visible:outline-(--hn-focus-ring) peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2',
      ]"
      :data-state="checked === true ? 'checked' : 'unchecked'"
    >
      <Transition
        enter-active-class="hn-transition-press"
        enter-from-class="scale-50 opacity-0"
        leave-active-class="hn-transition"
        leave-to-class="scale-50 opacity-0"
      >
        <span v-if="checked === true" :class="radioDot()" />
      </Transition>
    </span>
  </label>
  <Checkbox
    v-else
    :model-value="checked"
    :disabled="disabled"
    :aria-label="label"
    @update:model-value="$emit('change', $event === true)"
  />
</template>
