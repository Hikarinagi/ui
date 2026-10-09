import {
  computed,
  createCommentVNode,
  defineComponent,
  Fragment,
  h,
  mergeProps,
  renderSlot,
  toRefs,
  withCtx,
  withModifiers,
  type PropType,
} from 'vue'
import { getLabelText } from '../../../../shared/src/primitives/label'
import { dispatchRadioSelect } from '../../../../shared/src/primitives/radio-group'
import { Primitive, type PrimitiveProps } from '../primitive'
import type { AcceptableValue } from '../utils/types'
import { useFormControl } from '../utils/useFormControl'
import { useForwardExpose } from '../utils/useForwardExpose'
import { useForwardScopeId } from '../utils/useForwardScopeId'
import { useVModel } from '../utils/useVModel'
import { VisuallyHiddenInput } from '../visually-hidden'

export const Radio = defineComponent({
  name: 'Radio',
  inheritAttrs: false,
  props: {
    id: { type: String, required: false },
    value: { type: null as unknown as PropType<AcceptableValue>, required: false },
    disabled: { type: Boolean, required: false, default: false },
    checked: { type: Boolean, required: false, default: undefined },
    asChild: { type: Boolean, required: false },
    as: {
      type: null as unknown as PropType<PrimitiveProps['as']>,
      required: false,
      default: 'button',
    },
    name: { type: String, required: false },
    required: { type: Boolean, required: false },
  },
  emits: ['update:checked', 'select'],
  setup(props, { emit, attrs, slots }) {
    const checked = useVModel(props, 'checked', (_, value) => emit('update:checked', value), {
      passive: props.checked === undefined,
    })
    const { value } = toRefs(props)
    const { forwardRef, currentElement: triggerElement } = useForwardExpose()
    const isFormControl = useFormControl(triggerElement)
    const scopeIdAttrs = useForwardScopeId()
    const ariaLabel = computed(() => getLabelText(props.id, triggerElement.value))

    function handleClick(event: MouseEvent) {
      if (props.disabled) return
      dispatchRadioSelect(event, props.value, selectEvent => {
        emit('select', selectEvent)
        if (selectEvent?.defaultPrevented) return
        checked.value = true
        if (isFormControl.value) selectEvent.stopPropagation()
      })
    }

    return () =>
      h(Fragment, null, [
        h(
          Primitive,
          mergeProps(
            {
              id: props.id,
              ref: forwardRef,
              role: 'radio',
              type: props.as === 'button' ? 'button' : undefined,
              as: props.as,
              'aria-checked': checked.value ?? false,
              'aria-label': ariaLabel.value,
              'as-child': props.asChild,
              disabled: props.disabled ? '' : undefined,
              'data-state': checked.value ? 'checked' : 'unchecked',
              'data-disabled': props.disabled ? '' : undefined,
              value: value.value,
              required: props.required,
              name: props.name,
            },
            { ...scopeIdAttrs, ...attrs },
            { onClick: withModifiers(handleClick as (event: Event) => void, ['stop']) },
          ),
          {
            default: withCtx(() => [renderSlot(slots, 'default', { checked: checked.value })]),
          },
        ),
        isFormControl.value && props.name
          ? h(
              VisuallyHiddenInput,
              mergeProps(
                {
                  key: 0,
                  type: 'radio',
                  tabindex: '-1',
                  value: value.value,
                  checked: !!checked.value,
                  name: props.name,
                  disabled: props.disabled,
                  required: props.required,
                },
                scopeIdAttrs,
              ) as { name: string; value: unknown },
            )
          : createCommentVNode('v-if', true),
      ])
  },
})
