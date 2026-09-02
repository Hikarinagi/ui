<script setup lang="ts">
  import { computed, shallowRef, useSlots } from 'vue'
  import { cn } from '../../lib/cn'
  import { focusFieldFrom } from '../../lib/field-focus'
  import { useUiLocale } from '../../locale'
  import IconSlot from '../button/IconSlot.vue'
  import CloseButton from '../close-button/CloseButton.vue'
  import Spinner from '../spinner/Spinner.vue'
  import { injectInputGroup } from '../input-group/context'
  import {
    inputAdornment,
    inputControl,
    inputEmbedded,
    inputHost,
    type InputVariants,
  } from './input.variants'

  defineOptions({ name: 'HnInput', inheritAttrs: false })

  const props = defineProps<{
    variant?: InputVariants['variant']
    size?: InputVariants['size']
    clearable?: boolean
    loading?: boolean
    disabled?: boolean
    invalid?: boolean
    class?: string
  }>()
  const emit = defineEmits<{ clear: [] }>()

  const model = defineModel<string>()

  const slots = useSlots()
  const t = useUiLocale()
  const group = injectInputGroup()
  const el = shallowRef<HTMLInputElement | null>(null)

  const size = computed(() => (group ? group.size.value : props.size))
  const disabled = computed(() => props.disabled || !!group?.disabled.value)
  const invalid = computed(() => props.invalid || !!group?.invalid.value)
  const clearing = computed(() => !!props.clearable && !!model.value && !disabled.value)
  const trailingSpinner = computed(() => !!props.loading && !slots.leading)
  const spinnerSize = computed(() => (size.value === 'lg' ? 'md' : 'sm'))
  const closeSize = computed(() => (size.value === 'sm' ? 'xs' : size.value === 'lg' ? 'md' : 'sm'))

  function clear() {
    if (!model.value) return
    model.value = ''
    emit('clear')
    el.value?.focus()
  }

  defineExpose({ clear, focus: () => el.value?.focus() })
</script>

<template>
  <div
    data-hn-input
    :data-invalid="invalid ? '' : undefined"
    :aria-busy="props.loading || undefined"
    :class="
      cn(
        group ? inputEmbedded() : inputHost({ variant: props.variant, size: props.size }),
        props.class,
      )
    "
    @click="focusFieldFrom($event.currentTarget as HTMLElement, $event.target as HTMLElement)"
  >
    <span v-if="slots.leading" :class="inputAdornment()">
      <IconSlot
        box-class="relative inline-flex items-center justify-center"
        :swapped="!!props.loading"
        :spinner-size="spinnerSize"
      >
        <slot name="leading" />
      </IconSlot>
    </span>
    <input
      ref="el"
      v-bind="$attrs"
      v-model="model"
      :disabled="disabled"
      :aria-invalid="invalid || undefined"
      :class="
        inputControl({
          leading: !!slots.leading,
          trailing: clearing || trailingSpinner || !!slots.trailing,
        })
      "
    />
    <Transition
      enter-active-class="hn-transition-base"
      enter-from-class="scale-90 opacity-0"
      leave-active-class="hn-transition"
      leave-to-class="scale-90 opacity-0"
    >
      <span v-if="trailingSpinner" :class="inputAdornment()">
        <Spinner :size="spinnerSize" />
      </span>
    </Transition>
    <Transition
      enter-active-class="hn-transition-base"
      enter-from-class="scale-90 opacity-0"
      leave-active-class="hn-transition"
      leave-to-class="scale-90 opacity-0"
    >
      <span v-if="clearing" :class="inputAdornment()">
        <CloseButton :label="t.common.clear" :size="closeSize" @mousedown.prevent @click="clear" />
      </span>
    </Transition>
    <span v-if="slots.trailing" :class="inputAdornment()">
      <slot name="trailing" />
    </span>
  </div>
</template>
