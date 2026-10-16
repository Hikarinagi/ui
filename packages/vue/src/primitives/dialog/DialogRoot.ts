import { defineComponent, ref, renderSlot, toRefs, type Ref } from 'vue'
import { useVModel } from '../utils/useVModel'
import { provideDialogRootContext } from './context'

export interface DialogRootProps {
  open?: boolean
  defaultOpen?: boolean
  modal?: boolean
  unmountOnHide?: boolean
}

export type DialogRootEmits = {
  'update:open': [value: boolean]
}

export const DialogRoot = defineComponent({
  name: 'DialogRoot',
  inheritAttrs: false,
  props: {
    open: { type: Boolean, required: false, default: undefined },
    defaultOpen: { type: Boolean, required: false, default: false },
    modal: { type: Boolean, required: false, default: true },
    unmountOnHide: { type: Boolean, required: false, default: true },
  },
  emits: ['update:open'],
  setup(props, { emit, slots }) {
    const open = useVModel(props, 'open', emit, {
      defaultValue: props.defaultOpen,
      passive: props.open === undefined,
    }) as Ref<boolean>
    const triggerElement = ref<HTMLElement>()
    const contentElement = ref<HTMLElement>()
    const { modal, unmountOnHide } = toRefs(props)

    provideDialogRootContext({
      open,
      modal,
      unmountOnHide,
      openModal: () => {
        open.value = true
      },
      onOpenChange: value => {
        open.value = value
      },
      onOpenToggle: () => {
        open.value = !open.value
      },
      contentId: '',
      titleId: '',
      descriptionId: '',
      triggerElement,
      contentElement,
    })

    return () =>
      renderSlot(slots, 'default', {
        open: open.value,
        close: () => (open.value = false),
      })
  },
})
