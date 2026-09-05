<script setup lang="ts">
  import { computed, shallowRef, useSlots } from 'vue'
  import { cn } from '../../lib/cn'
  import { focusFieldFrom } from '../../lib/field-focus'
  import { useUiLocale } from '../../locale'
  import { X } from '@lucide/vue'
  import IconSlot from '../button/IconSlot.vue'
  import InputAction from './InputAction.vue'
  import Spinner from '../spinner/Spinner.vue'
  import { useFieldControl } from '../form-field/context'
  import { injectInputGroup } from '../input-group/context'
  import {
    inputActionSlot,
    inputAdornment,
    inputControl,
    inputEmbedded,
    inputHost,
    type InputVariants,
  } from './input.variants'

  defineOptions({ name: 'HnInputBase', inheritAttrs: false })

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
  const {
    id: fieldId,
    invalid,
    disabled,
    describedBy,
  } = useFieldControl({
    invalid: () => props.invalid || !!group?.invalid.value,
    disabled: () => props.disabled || !!group?.disabled.value,
  })
  const clearing = computed(() => !!props.clearable && !!model.value && !disabled.value)
  const trailingSpinner = computed(() => !!props.loading && !slots.leading)
  const spinnerSize = computed(() => (size.value === 'lg' ? 'md' : 'sm'))

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
      :id="fieldId"
      :disabled="disabled"
      :aria-invalid="invalid || undefined"
      :aria-describedby="describedBy"
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
      <span v-if="clearing" :class="inputActionSlot()">
        <InputAction :label="t.common.clear" @click="clear">
          <X />
        </InputAction>
      </span>
    </Transition>
    <slot name="action" />
    <span v-if="slots.trailing" :class="inputAdornment()">
      <slot name="trailing" />
    </span>
  </div>
</template>
