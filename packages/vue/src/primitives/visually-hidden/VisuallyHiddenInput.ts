import {
  computed,
  createCommentVNode,
  defineComponent,
  Fragment,
  h,
  mergeProps,
  type PropType,
} from 'vue'
import type { VisuallyHiddenProps } from './VisuallyHidden.vue'
import VisuallyHiddenInputBubble from './VisuallyHiddenInputBubble.vue'

const REQUIRED_NOTE = " We render single input if it's required "

type BubbleProps = { name: string; value: unknown }

export default defineComponent({
  name: 'VisuallyHiddenInput',
  inheritAttrs: false,
  props: {
    name: { type: String, required: true },
    value: { type: null as unknown as PropType<unknown>, required: true },
    checked: { type: Boolean, required: false, default: undefined },
    required: { type: Boolean, required: false },
    disabled: { type: Boolean, required: false },
    feature: {
      type: String as PropType<VisuallyHiddenProps['feature']>,
      required: false,
      default: 'fully-hidden',
    },
  },
  setup(props, { attrs }) {
    const isFormArrayEmptyAndRequired = computed(
      () => Array.isArray(props.value) && props.value.length === 0 && props.required,
    )
    const parsedValue = computed(() => {
      const value = props.value
      if (
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean' ||
        value === null ||
        value === undefined
      )
        return [{ name: props.name, value }]
      if (Array.isArray(value))
        return value.flatMap((item: unknown, index) =>
          typeof item === 'object'
            ? Object.entries(item as object).map(([key, entry]) => ({
                name: `${props.name}[${index}][${key}]`,
                value: entry as unknown,
              }))
            : { name: `${props.name}[${index}]`, value: item },
        )
      if (typeof value === 'object')
        return Object.entries(value as object).map(([key, entry]) => ({
          name: `${props.name}[${key}]`,
          value: entry as unknown,
        }))
      return []
    })

    return () =>
      h(Fragment, null, [
        createCommentVNode(REQUIRED_NOTE),
        isFormArrayEmptyAndRequired.value
          ? h(
              VisuallyHiddenInputBubble,
              mergeProps(
                { key: props.name },
                { ...props, ...attrs },
                {
                  name: props.name,
                  value: props.value,
                },
              ) as BubbleProps,
            )
          : h(
              Fragment,
              { key: 1 },
              parsedValue.value.map(parsed =>
                h(
                  VisuallyHiddenInputBubble,
                  mergeProps(
                    { key: parsed.name },
                    { ...props, ...attrs },
                    {
                      name: parsed.name,
                      value: parsed.value,
                    },
                  ) as BubbleProps,
                ),
              ),
            ),
      ])
  },
})
