import {
  computed,
  createCommentVNode,
  defineComponent,
  h,
  ref,
  renderSlot,
  toRefs,
  withCtx,
  type PropType,
  type Ref,
} from 'vue'
import { useFocusWithin } from '@vueuse/core'
import {
  addTagsInputValue,
  removeTagsInputValue,
  tagsInputDisplayValue,
  tagsInputKeydown,
  tagsInputValueIndex,
  type AcceptableInputValue,
} from '../../../../shared/src/primitives/tags-input'
import { useCollection } from '../collection'
import { Primitive, type PrimitiveProps } from '../primitive'
import { useDirection, type Direction } from '../utils/useDirection'
import { useFormControl } from '../utils/useFormControl'
import { useForwardExpose } from '../utils/useForwardExpose'
import { useVModel } from '../utils/useVModel'
import { VisuallyHiddenInput } from '../visually-hidden'
import { provideTagsInputRootContext } from './context'

export interface TagsInputRootProps<T = AcceptableInputValue> {
  modelValue?: Array<T> | null
  defaultValue?: Array<T>
  addOnPaste?: boolean
  addOnTab?: boolean
  addOnBlur?: boolean
  duplicate?: boolean
  disabled?: boolean
  delimiter?: string | RegExp
  dir?: Direction
  max?: number
  id?: string
  convertValue?: (value: string) => T
  displayValue?: (value: T) => string
  asChild?: boolean
  as?: PrimitiveProps['as']
  name?: string
  required?: boolean
}

export type TagsInputRootEmits<T = AcceptableInputValue> = {
  'update:modelValue': [payload: Array<T>]
  invalid: [payload: T]
  addTag: [payload: T]
  removeTag: [payload: T]
}

export const TagsInputRoot = defineComponent({
  name: 'TagsInputRoot',
  props: {
    modelValue: { type: [Array, null] as PropType<AcceptableInputValue[] | null>, required: false },
    defaultValue: {
      type: Array as PropType<AcceptableInputValue[]>,
      required: false,
      default: () => [],
    },
    addOnPaste: { type: Boolean, required: false },
    addOnTab: { type: Boolean, required: false },
    addOnBlur: { type: Boolean, required: false },
    duplicate: { type: Boolean, required: false },
    disabled: { type: Boolean, required: false },
    delimiter: {
      type: null as unknown as PropType<string | RegExp>,
      required: false,
      default: ',',
    },
    dir: { type: String as PropType<Direction>, required: false },
    max: { type: Number, required: false, default: 0 },
    id: { type: String, required: false },
    convertValue: {
      type: Function as PropType<(value: string) => AcceptableInputValue>,
      required: false,
    },
    displayValue: {
      type: Function as PropType<(value: AcceptableInputValue) => string>,
      required: false,
      default: tagsInputDisplayValue,
    },
    asChild: { type: Boolean, required: false },
    as: { type: null as unknown as PropType<PrimitiveProps['as']>, required: false },
    name: { type: String, required: false },
    required: { type: Boolean, required: false },
  },
  emits: ['update:modelValue', 'invalid', 'addTag', 'removeTag'],
  setup(props, { emit, slots }) {
    const {
      addOnPaste,
      disabled,
      delimiter,
      max,
      id,
      dir: propDir,
      addOnBlur,
      addOnTab,
    } = toRefs(props)
    const dir = useDirection(propDir)

    const modelValue = useVModel(props, 'modelValue', emit, {
      defaultValue: props.defaultValue,
      passive: true,
    }) as Ref<AcceptableInputValue[]>

    const { forwardRef, currentElement } = useForwardExpose()
    const { focused } = useFocusWithin(currentElement)
    const isFormControl = useFormControl(currentElement)

    const { getItems, CollectionSlot } = useCollection({ isProvider: true })

    const selectedElement = ref<HTMLElement>()
    const isInvalidInput = ref(false)

    function handleRemoveTag(index: number) {
      if (index !== -1) {
        const removedValue = modelValue.value[index]
        modelValue.value = removeTagsInputValue(modelValue.value, index)
        emit('removeTag', removedValue)
      }
    }

    provideTagsInputRootContext({
      modelValue,
      onAddValue: text => {
        const result = addTagsInputValue(modelValue.value, text, {
          duplicate: props.duplicate,
          max: max.value,
          defaultValue: props.defaultValue,
          convertValue: props.convertValue,
        })
        if (result.added) {
          modelValue.value = result.value
          emit('addTag', result.payload)
          return true
        }
        if (result.duplicate) isInvalidInput.value = true
        emit('invalid', result.payload)
        return false
      },
      onRemoveValue: handleRemoveTag,
      onInputKeydown: event => {
        if (event.isComposing) return
        const target = event.target as HTMLInputElement
        const action = tagsInputKeydown(event, {
          caretAtStart: target.selectionStart === 0 && target.selectionEnd === 0,
          items: getItems()
            .map(item => item.ref)
            .filter(item => item.dataset.disabled !== ''),
          selected: selectedElement.value,
          dir: dir.value,
        })
        if (!action) return
        if (action.remove) {
          const selectedItem = getItems().find(item => item.ref === action.remove)
          handleRemoveTag(
            selectedItem ? tagsInputValueIndex(modelValue.value, selectedItem.value) : -1,
          )
        }
        if (action.select) selectedElement.value = action.select.element
        if (action.preventDefault) event.preventDefault()
      },
      selectedElement,
      isInvalidInput,
      addOnPaste,
      addOnBlur,
      addOnTab,
      dir,
      disabled,
      delimiter,
      max,
      id,
      displayValue: props.displayValue,
    })

    return () =>
      h(CollectionSlot, null, {
        default: withCtx(() => [
          h(
            Primitive,
            {
              ref: forwardRef,
              dir: dir.value,
              as: props.as,
              'as-child': props.asChild,
              'data-invalid': isInvalidInput.value ? '' : undefined,
              'data-disabled': disabled.value ? '' : undefined,
              'data-focused': focused.value ? '' : undefined,
            },
            {
              default: withCtx(() => [
                renderSlot(slots, 'default', { modelValue: modelValue.value }),
                isFormControl.value && props.name
                  ? h(VisuallyHiddenInput, {
                      key: 0,
                      name: props.name,
                      value: modelValue.value,
                      required: props.required,
                      disabled: disabled.value,
                    })
                  : createCommentVNode('v-if', true),
              ]),
            },
          ),
        ]),
      })
  },
})
