<script setup lang="ts">
  import { cn } from '../../lib/cn'
  import { useFieldControl } from '../form-field/context'
  import { useTextareaSizing } from './composables/useTextareaSizing'
  import ScrollArea from '../scroll-area/ScrollArea.vue'
  import { textarea, textareaField, type TextareaVariants } from './textarea.variants'

  defineOptions({ name: 'HnTextarea', inheritAttrs: false })

  const {
    id: fieldId,
    invalid,
    disabled,
    describedBy,
  } = useFieldControl({
    invalid: () => props.invalid,
    disabled: () => props.disabled,
  })

  const props = withDefaults(
    defineProps<{
      variant?: TextareaVariants['variant']
      size?: TextareaVariants['size']
      rows?: number
      autosize?: boolean | { minRows?: number; maxRows?: number }
      resize?: TextareaVariants['resize']
      disabled?: boolean
      invalid?: boolean
      class?: string
    }>(),
    { rows: 3 },
  )

  const model = defineModel<string>()

  const { el, area, bounds, fit, focus } = useTextareaSizing(props, model)
</script>

<template>
  <div
    data-hn-textarea
    :data-invalid="invalid ? '' : undefined"
    :data-disabled="disabled ? '' : undefined"
    :style="{ '--hn-textarea-rows': bounds.min, '--hn-textarea-max-rows': bounds.max }"
    :class="
      cn(
        textarea({
          variant: props.variant,
          size: props.size,
          autosize: Boolean(props.autosize),
          resize: props.autosize ? 'none' : props.resize,
        }),
        props.class,
      )
    "
    @click="focus"
  >
    <ScrollArea ref="area" :shadow="false" class="min-h-0 grow">
      <textarea
        ref="el"
        v-bind="$attrs"
        v-model="model"
        :id="fieldId"
        :rows="bounds.min"
        :disabled="disabled"
        :aria-invalid="invalid || undefined"
        :aria-describedby="describedBy"
        :class="textareaField()"
        @input="fit"
      />
    </ScrollArea>
  </div>
</template>
