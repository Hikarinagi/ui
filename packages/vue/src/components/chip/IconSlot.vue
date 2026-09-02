<script setup lang="ts">
  import { Check } from '@lucide/vue'
  import { chipIcon, type ChipVariants } from './chip.variants'

  defineOptions({ name: 'HnChipIconSlot' })

  const props = defineProps<{
    size?: ChipVariants['size']
    checked: boolean
    icon: boolean
  }>()
</script>

<template>
  <span
    class="grid [transition:grid-template-columns_var(--hn-duration-base)_var(--hn-ease-move)]"
    :class="props.icon || props.checked ? 'grid-cols-[1fr]' : 'grid-cols-[0fr]'"
  >
    <span class="flex min-w-0 overflow-hidden">
      <span :class="chipIcon({ size: props.size })">
        <span
          v-if="props.icon"
          class="hn-transition inline-flex items-center justify-center"
          :class="props.checked ? 'scale-90 opacity-0' : 'scale-100 opacity-100'"
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
            v-if="props.checked"
            aria-hidden="true"
            class="absolute inset-0 inline-flex items-center justify-center"
          >
            <Check />
          </span>
        </Transition>
      </span>
    </span>
  </span>
</template>
