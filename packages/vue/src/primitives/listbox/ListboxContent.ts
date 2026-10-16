import {
  defineComponent,
  h,
  renderSlot,
  withCtx,
  withKeys,
  withModifiers,
  type PropType,
} from 'vue'
import { refAutoReset } from '@vueuse/core'
import {
  ignoresListboxArrow,
  listboxContentTabIndex,
} from '../../../../shared/src/primitives/listbox'
import { useCollection } from '../collection'
import { Primitive, type PrimitiveProps } from '../primitive'
import { injectListboxRootContext } from './context'

export interface ListboxContentProps {
  asChild?: boolean
  as?: PrimitiveProps['as']
}

export const ListboxContent = defineComponent({
  name: 'ListboxContent',
  props: {
    asChild: { type: Boolean, required: false },
    as: { type: null as unknown as PropType<PrimitiveProps['as']>, required: false },
  },
  setup(props, { slots }) {
    const { CollectionSlot } = useCollection()
    const rootContext = injectListboxRootContext()
    const isClickFocus = refAutoReset(false, 10)

    const onMousedown = withModifiers(() => {
      isClickFocus.value = true
    }, ['left'])
    const onFocus = (event: FocusEvent) => {
      if (isClickFocus.value) return
      rootContext.onEnter(event)
    }
    const onNavigate = withKeys(
      (event: KeyboardEvent) => {
        if (ignoresListboxArrow(event.key, rootContext.orientation.value)) return
        event.preventDefault()
        if (rootContext.focusable.value) rootContext.onKeydownNavigation(event)
      },
      ['down', 'up', 'left', 'right', 'home', 'end'],
    )

    return () =>
      h(CollectionSlot, null, {
        default: withCtx(() => [
          h(
            Primitive,
            {
              role: 'listbox',
              as: props.as,
              'as-child': props.asChild,
              tabindex: listboxContentTabIndex(
                rootContext.focusable.value,
                !!rootContext.highlightedElement.value,
              ),
              'aria-orientation': rootContext.orientation.value,
              'aria-multiselectable': !!rootContext.multiple.value,
              'data-orientation': rootContext.orientation.value,
              onMousedown,
              onFocus,
              onKeydown: [
                onNavigate,
                withKeys(rootContext.onKeydownEnter, ['enter']),
                rootContext.onKeydownTypeAhead,
              ],
            },
            { default: withCtx(() => [renderSlot(slots, 'default')]) },
          ),
        ]),
      })
  },
})
