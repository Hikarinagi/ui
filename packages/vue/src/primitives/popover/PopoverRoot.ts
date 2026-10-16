import { defineComponent, h, ref, renderSlot, toRefs, withCtx, type Ref } from 'vue'
import { PopperRoot } from '../popper'
import { useVModel } from '../utils/useVModel'
import { providePopoverRootContext } from './context'

export interface PopoverRootProps {
  defaultOpen?: boolean
  open?: boolean
  modal?: boolean
}

export type PopoverRootEmits = {
  'update:open': [value: boolean]
}

export const PopoverRoot = defineComponent({
  name: 'PopoverRoot',
  props: {
    defaultOpen: { type: Boolean, required: false, default: false },
    open: { type: Boolean, required: false, default: undefined },
    modal: { type: Boolean, required: false, default: false },
  },
  emits: ['update:open'],
  setup(props, { emit, slots }) {
    const { modal } = toRefs(props)
    const open = useVModel(props, 'open', emit, {
      defaultValue: props.defaultOpen,
      passive: props.open === undefined,
    }) as Ref<boolean>
    const triggerElement = ref<HTMLElement>()
    const hasCustomAnchor = ref(false)

    providePopoverRootContext({
      contentId: '',
      triggerId: '',
      modal,
      open,
      onOpenChange: value => {
        open.value = value
      },
      onOpenToggle: () => {
        open.value = !open.value
      },
      triggerElement,
      hasCustomAnchor,
    })

    return () =>
      h(PopperRoot, null, {
        default: withCtx(() => [
          renderSlot(slots, 'default', {
            open: open.value,
            close: () => (open.value = false),
          }),
        ]),
      })
  },
})
