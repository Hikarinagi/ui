<script setup lang="ts">
  import { computed, nextTick, onMounted, shallowRef, watch } from 'vue'
  import { cn } from '../../lib/cn'
  import { useFieldControl } from '../form-field/context'
  import { caretTop } from '../../lib/caret'
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

  const el = shallowRef<HTMLTextAreaElement | null>(null)
  const area = shallowRef<InstanceType<typeof ScrollArea>>()

  const bounds = computed(() => {
    const options = props.autosize === true ? {} : props.autosize || null
    return { min: options?.minRows ?? props.rows, max: options?.maxRows }
  })

  function fit() {
    const node = el.value
    if (!node) return
    node.style.height = 'auto'
    node.style.height = `${node.scrollHeight}px`
    if (document.activeElement === node) reveal(node)
  }

  function reveal(node: HTMLTextAreaElement) {
    const scroller =
      area.value?.viewport ?? node.closest<HTMLElement>('[data-overlayscrollbars-initialize]')
    if (!scroller) return
    const box = scroller.getBoundingClientRect()
    const top = node.getBoundingClientRect().top + caretTop(node)
    const bottom = top + parseFloat(getComputedStyle(node).lineHeight)
    if (bottom > box.bottom) scroller.scrollTop += bottom - box.bottom
    else if (top < box.top) scroller.scrollTop -= box.top - top
  }

  function focus(event: MouseEvent) {
    const node = el.value
    if (!node || node.disabled || event.target === node) return
    node.focus()
    node.setSelectionRange(node.value.length, node.value.length)
  }

  onMounted(fit)
  watch(
    () => [model.value, props.size, props.variant, bounds.value.min],
    () => void nextTick(fit),
  )
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
