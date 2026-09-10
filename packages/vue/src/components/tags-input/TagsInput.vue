<script setup lang="ts">
  import { TagsInputInput, TagsInputItem, TagsInputRoot } from 'reka-ui'
  import { computed } from 'vue'
  import { cn } from '../../lib/cn'
  import { useFieldControl } from '../form-field/context'
  import { focusFieldFrom } from '../../lib/field-focus'
  import { useUiLocale } from '../../locale'
  import { X } from '@lucide/vue'
  import InputAction from '../input/InputAction.vue'
  import { inputActionSlot, inputHost, type InputVariants } from '../input/input.variants'
  import TagsInputChip from './TagsInputChip.vue'
  import { tagsInputControl, tagsInputHost, tagsInputList } from './tags-input.variants'

  defineOptions({ name: 'HnTagsInput', inheritAttrs: false })

  const props = withDefaults(
    defineProps<{
      placeholder?: string
      max?: number
      duplicate?: boolean
      delimiter?: string | RegExp
      addOnPaste?: boolean
      addOnBlur?: boolean
      clearable?: boolean
      name?: string
      variant?: InputVariants['variant']
      size?: InputVariants['size']
      disabled?: boolean
      invalid?: boolean
      class?: string
    }>(),
    { max: 0, delimiter: ',', addOnPaste: true, addOnBlur: false, clearable: false },
  )

  const emit = defineEmits<{ invalid: [value: string]; clear: [] }>()

  const model = defineModel<string[]>({ default: () => [] })

  const t = useUiLocale()

  const {
    id: fieldId,
    invalid,
    disabled,
    describedBy,
  } = useFieldControl({
    invalid: () => props.invalid,
    disabled: () => props.disabled,
  })

  const chipSize = computed(() => (props.size === 'sm' ? 'sm' : 'md'))
  const clearing = computed(() => props.clearable && model.value.length > 0 && !disabled.value)

  function remove(tag: string) {
    if (disabled.value) return
    model.value = model.value.filter(item => item !== tag)
  }

  function clear() {
    if (!model.value.length) return
    model.value = []
    emit('clear')
  }

  function onInputKeydown(event: KeyboardEvent) {
    if (event.isComposing || (event.target as HTMLInputElement).value !== '') return
    if (event.key === 'Backspace') {
      event.preventDefault()
      event.stopImmediatePropagation()
      if (model.value.length) model.value = model.value.slice(0, -1)
    } else if (event.key === 'Delete' || event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.stopImmediatePropagation()
    }
  }
</script>

<template>
  <div
    data-hn-tags-input
    :data-invalid="invalid ? '' : undefined"
    :data-disabled="disabled ? '' : undefined"
    @click="focusFieldFrom($event.currentTarget as HTMLElement, $event.target as HTMLElement)"
    :class="
      cn(
        inputHost({ variant: props.variant, size: props.size }),
        tagsInputHost({ size: props.size, trailing: clearing }),
        props.class,
      )
    "
  >
    <TagsInputRoot
      v-model="model"
      :max="props.max"
      :duplicate="props.duplicate"
      :delimiter="props.delimiter"
      :add-on-paste="props.addOnPaste"
      :add-on-blur="props.addOnBlur"
      :name="props.name"
      :disabled="disabled"
      :class="tagsInputList()"
      @invalid="value => emit('invalid', String(value))"
    >
      <TagsInputItem v-for="tag in model" :key="tag" :value="tag" as-child>
        <TagsInputChip :tag="tag" :size="chipSize" :disabled="disabled" @remove="remove(tag)" />
      </TagsInputItem>
      <TagsInputInput
        v-bind="$attrs"
        @keydown.capture="onInputKeydown"
        :id="fieldId"
        :placeholder="props.placeholder"
        :aria-invalid="invalid || undefined"
        :aria-describedby="describedBy"
        :class="tagsInputControl({ size: props.size })"
      />
    </TagsInputRoot>
    <Transition
      enter-active-class="hn-transition-base"
      enter-from-class="scale-90 opacity-0"
      leave-active-class="hn-transition"
      leave-to-class="scale-90 opacity-0"
    >
      <span
        v-if="clearing"
        data-hn-tags-input-clear
        :class="cn(inputActionSlot(), 'absolute inset-y-0 end-0')"
      >
        <InputAction :label="t.common.clear" @click.stop="clear">
          <X />
        </InputAction>
      </span>
    </Transition>
  </div>
</template>
