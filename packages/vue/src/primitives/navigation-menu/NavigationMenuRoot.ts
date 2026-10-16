import { refAutoReset, useDebounceFn, useEventListener } from '@vueuse/core'
import {
  computed,
  defineComponent,
  h,
  ref,
  renderSlot,
  toRefs,
  watchEffect,
  withCtx,
  type PropType,
  type Ref,
} from 'vue'
import { EVENT_ROOT_CONTENT_DISMISS } from '../../../../shared/src/primitives/navigation-menu'
import { useCollection } from '../collection'
import { Primitive, type PrimitiveProps } from '../primitive'
import { useDirection, type Direction } from '../utils/useDirection'
import { useForwardExpose } from '../utils/useForwardExpose'
import { useId } from '../utils/useId'
import { useVModel } from '../utils/useVModel'
import {
  injectNavigationMenuContext,
  provideNavigationMenuContext,
  type Orientation,
} from './context'

export const NavigationMenuRoot = defineComponent({
  name: 'NavigationMenuRoot',
  props: {
    modelValue: { type: String, required: false, default: undefined },
    defaultValue: { type: String, required: false },
    dir: { type: String as PropType<Direction>, required: false },
    orientation: {
      type: String as PropType<Orientation>,
      required: false,
      default: 'horizontal',
    },
    delayDuration: { type: Number, required: false, default: 200 },
    skipDelayDuration: { type: Number, required: false, default: 300 },
    disableClickTrigger: { type: Boolean, required: false, default: false },
    disableHoverTrigger: { type: Boolean, required: false, default: false },
    disablePointerLeaveClose: { type: Boolean, required: false },
    unmountOnHide: { type: Boolean, required: false, default: true },
    asChild: { type: Boolean, required: false },
    as: {
      type: null as unknown as PropType<PrimitiveProps['as']>,
      required: false,
      default: 'nav',
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit, slots }) {
    const modelValue = useVModel(props, 'modelValue', emit, {
      defaultValue: props.defaultValue ?? '',
      passive: props.modelValue === undefined,
    }) as Ref<string>
    const previousValue = ref('')
    const { forwardRef, currentElement: rootNavigationMenu } = useForwardExpose()
    const indicatorTrack = ref<HTMLElement>()
    const viewport = ref<HTMLElement>()
    const activeTrigger = ref<HTMLElement>()
    const { getItems, CollectionSlot } = useCollection({ key: 'NavigationMenu', isProvider: true })
    const {
      delayDuration,
      skipDelayDuration,
      dir: propDir,
      disableClickTrigger,
      disableHoverTrigger,
      unmountOnHide,
    } = toRefs(props)
    const dir = useDirection(propDir)
    const isDelaySkipped = refAutoReset(false, skipDelayDuration)
    const skipNextClose = ref(false)
    const computedDelay = computed(() => {
      const isOpen = modelValue.value !== ''
      if (isOpen || isDelaySkipped.value) return 150
      return delayDuration.value
    })

    const debouncedFn = useDebounceFn((value?: string) => {
      if (typeof value === 'string') {
        if (value === '' && skipNextClose.value) {
          skipNextClose.value = false
          return
        }
        previousValue.value = modelValue.value
        modelValue.value = value
        if (value === '') isDelaySkipped.value = true
      }
    }, computedDelay)

    watchEffect(() => {
      if (!modelValue.value) return
      const items = getItems().map(item => item.ref)
      activeTrigger.value = items.find(item => item.id.includes(modelValue.value))
    })

    useEventListener(rootNavigationMenu, EVENT_ROOT_CONTENT_DISMISS, onItemDismiss)

    provideNavigationMenuContext({
      isRootMenu: true,
      modelValue,
      previousValue,
      baseId: useId(undefined, 'reka-navigation-menu'),
      disableClickTrigger,
      disableHoverTrigger,
      dir,
      unmountOnHide,
      orientation: props.orientation,
      rootNavigationMenu: rootNavigationMenu as Ref<HTMLElement | undefined>,
      indicatorTrack,
      activeTrigger,
      onIndicatorTrackChange: value => {
        indicatorTrack.value = value
      },
      viewport,
      onViewportChange: value => {
        viewport.value = value
      },
      onTriggerEnter: value => {
        if (modelValue.value !== '') {
          skipNextClose.value = true
          previousValue.value = modelValue.value
          modelValue.value = value
        } else debouncedFn(value)
      },
      onTriggerLeave: () => {
        skipNextClose.value = false
        debouncedFn('')
      },
      onContentEnter: () => {
        debouncedFn()
      },
      onContentLeave: () => {
        if (!props.disablePointerLeaveClose) {
          skipNextClose.value = false
          debouncedFn('')
        }
      },
      onItemSelect: value => {
        previousValue.value = modelValue.value
        modelValue.value = value
      },
      onItemDismiss,
    })

    function onItemDismiss() {
      previousValue.value = modelValue.value
      modelValue.value = ''
    }

    return () =>
      h(CollectionSlot, null, {
        default: withCtx(() => [
          h(
            Primitive,
            {
              ref: forwardRef,
              as: props.as,
              'as-child': props.asChild,
              'data-orientation': props.orientation,
              dir: dir.value,
              'data-reka-navigation-menu': '',
            },
            {
              default: withCtx(() => [
                renderSlot(slots, 'default', { modelValue: modelValue.value }),
              ]),
            },
          ),
        ]),
      })
  },
})

export const NavigationMenuSub = defineComponent({
  name: 'NavigationMenuSub',
  props: {
    modelValue: { type: String, required: false },
    defaultValue: { type: String, required: false },
    orientation: {
      type: String as PropType<Orientation>,
      required: false,
      default: 'horizontal',
    },
    asChild: { type: Boolean, required: false },
    as: { type: null as unknown as PropType<PrimitiveProps['as']>, required: false },
  },
  emits: ['update:modelValue'],
  setup(props, { emit, slots }) {
    const modelValue = useVModel(props, 'modelValue', emit, {
      defaultValue: props.defaultValue ?? '',
      passive: props.modelValue === undefined,
    }) as Ref<string>
    const previousValue = ref('')
    const menuContext = injectNavigationMenuContext()
    const { forwardRef, currentElement } = useForwardExpose()
    const indicatorTrack = ref<HTMLElement>()
    const viewport = ref<HTMLElement>()
    const activeTrigger = ref<HTMLElement>()
    const { getItems, CollectionSlot } = useCollection({ key: 'NavigationMenu', isProvider: true })

    watchEffect(() => {
      if (!modelValue.value) return
      const items = getItems().map(item => item.ref)
      activeTrigger.value = items.find(item => item.id.includes(modelValue.value))
    })

    provideNavigationMenuContext({
      ...menuContext,
      isRootMenu: false,
      modelValue,
      previousValue,
      activeTrigger,
      orientation: props.orientation,
      rootNavigationMenu: currentElement as Ref<HTMLElement | undefined>,
      indicatorTrack,
      onIndicatorTrackChange: value => {
        indicatorTrack.value = value
      },
      viewport,
      onViewportChange: value => {
        viewport.value = value
      },
      onTriggerEnter: value => {
        modelValue.value = value
      },
      onTriggerLeave: () => {},
      onContentEnter: () => {},
      onContentLeave: () => {},
      onItemSelect: value => {
        modelValue.value = value
      },
      onItemDismiss: () => {
        modelValue.value = ''
      },
    })

    return () =>
      h(CollectionSlot, null, {
        default: withCtx(() => [
          h(
            Primitive,
            {
              ref: forwardRef,
              'data-orientation': props.orientation,
              'as-child': props.asChild,
              as: props.as,
              'data-reka-navigation-menu': '',
            },
            {
              default: withCtx(() => [
                renderSlot(slots, 'default', { modelValue: modelValue.value }),
              ]),
            },
          ),
        ]),
      })
  },
})
