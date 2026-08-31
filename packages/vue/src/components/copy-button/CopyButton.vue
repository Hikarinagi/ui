<script setup lang="ts">
  import { computed } from 'vue'
  import { Check, Copy } from '@lucide/vue'
  import IconButton from '../icon-button/IconButton.vue'
  import { useUiLocale } from '../../locale'
  import { useCopy, COPIED_RESET_MS } from './composables/useCopy'
  import type { ButtonVariants } from '../button/button.variants'

  defineOptions({ name: 'HnCopyButton', inheritAttrs: false })

  const props = withDefaults(
    defineProps<{
      text: string
      label?: string
      size?: ButtonVariants['size']
      timeout?: number
      disabled?: boolean
      tooltip?: boolean
      class?: string
    }>(),
    { size: 'sm', timeout: COPIED_RESET_MS },
  )

  const emit = defineEmits<{ copied: [text: string] }>()

  const t = useUiLocale()

  const { copied, copy } = useCopy(
    () => props.text,
    value => emit('copied', value),
    () => props.timeout,
  )

  const label = computed(() =>
    copied.value ? t.value.common.copied : (props.label ?? t.value.common.copy),
  )
</script>

<template>
  <IconButton
    v-bind="$attrs"
    :label="label"
    :tooltip="props.tooltip"
    :size="props.size"
    :disabled="props.disabled"
    :class="props.class"
    @click="copy"
  >
    <span class="relative inline-flex size-[1em]">
      <Transition
        enter-active-class="hn-transition-base"
        enter-from-class="scale-90 opacity-0"
        leave-active-class="hn-transition"
        leave-to-class="scale-90 opacity-0"
      >
        <Check v-if="copied" key="check" class="text-success-text absolute inset-0" />
        <Copy v-else key="copy" class="absolute inset-0" />
      </Transition>
    </span>
  </IconButton>
</template>
