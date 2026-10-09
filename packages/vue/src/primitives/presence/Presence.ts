import {
  defineComponent,
  getCurrentInstance,
  h,
  ref,
  toRefs,
  type ComponentPublicInstance,
  type SlotsType,
  type VNode,
} from 'vue'
import { unrefElement } from '@vueuse/core'
import { renderSlotFragments } from '../utils/renderSlotFragments'
import { usePresence } from './usePresence'

export interface PresenceProps {
  present: boolean
  forceMount?: boolean
}

export const Presence = defineComponent({
  name: 'Presence',
  props: {
    present: { type: Boolean, required: true },
    forceMount: { type: Boolean },
  },
  slots: Object as SlotsType<{ default: (props: { present: boolean }) => VNode[] }>,
  setup(props, { slots, expose }) {
    const { present, forceMount } = toRefs(props)
    const node = ref<HTMLElement>()
    const { isPresent } = usePresence(present, node)
    expose({ present: isPresent })

    const children = renderSlotFragments(slots.default({ present: isPresent.value }) || [])
    const instance = getCurrentInstance()
    if (children.length > 1) {
      const componentName = instance?.parent?.type.name
        ? `<${instance.parent.type.name} />`
        : 'component'
      throw new Error(
        [
          `Detected an invalid children for \`${componentName}\` for  \`Presence\` component.`,
          '',
          'Note: Presence works similarly to `v-if` directly, but it waits for animation/transition to finished before unmounting. So it expect only one direct child of valid VNode type.',
          'You can apply a few solutions:',
          [
            'Provide a single child element so that `presence` directive attach correctly.',
            'Ensure the first child is an actual element instead of a raw text node or comment node.',
          ]
            .map(line => `  - ${line}`)
            .join('\n'),
        ].join('\n'),
      )
    }

    return () => {
      if (forceMount.value || present.value || isPresent.value)
        return h(slots.default({ present: isPresent.value })[0]!, {
          ref: (value: Element | ComponentPublicInstance | null) => {
            const element = unrefElement(value as HTMLElement) as HTMLElement | undefined
            if (typeof element?.hasAttribute === 'undefined') return element
            if (element.hasAttribute('data-reka-popper-content-wrapper'))
              node.value = element.firstElementChild as HTMLElement
            else node.value = element
            return element
          },
        })
      return null
    }
  },
})
