import { computed, defineComponent, h, type PropType } from 'vue'
import {
  TooltipTrigger,
  TooltipRoot,
  injectTooltipProviderContext,
  injectTooltipRootContext,
} from 'reka-ui'
import TooltipBubble from './TooltipBubble.vue'
import { useTooltipTarget } from './composables/useTooltipTarget'
import type { TooltipDirectiveOptions } from './types'

const TooltipTarget = defineComponent({
  name: 'HnTooltipTarget',
  props: {
    target: { type: Object as PropType<HTMLElement>, required: true },
    options: { type: Object as PropType<TooltipDirectiveOptions>, required: true },
    revision: { type: Number, required: true },
  },
  setup(props) {
    const root = injectTooltipRootContext()
    const ExternalTarget = defineComponent({
      name: 'HnTooltipElement',
      inheritAttrs: false,
      setup(_, { attrs, expose }) {
        useTooltipTarget(props.target, attrs, () => props.revision)
        expose({ $el: props.target })
        return () => null
      },
    })
    return () => [
      h(TooltipTrigger, {
        key: root.disabled.value ? 'disabled' : 'enabled',
        reference: props.target,
        as: ExternalTarget,
      }),
      h(TooltipBubble, props.options),
    ]
  },
})

export default defineComponent({
  name: 'HnTooltipDirectiveRoot',
  props: {
    target: { type: Object as PropType<HTMLElement>, required: true },
    options: { type: Object as PropType<TooltipDirectiveOptions>, required: true },
    revision: { type: Number, required: true },
  },
  setup(props) {
    const provider = injectTooltipProviderContext(null)
    const disabled = computed(() => !!props.options.disabled || !props.options.content.trim())
    return () =>
      provider
        ? h(
            TooltipRoot,
            { disabled: disabled.value, ignoreNonKeyboardFocus: true },
            {
              default: () => h(TooltipTarget, props),
            },
          )
        : null
  },
})
