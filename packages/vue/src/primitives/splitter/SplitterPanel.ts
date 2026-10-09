import {
  computed,
  defineComponent,
  h,
  normalizeStyle,
  onMounted,
  onUnmounted,
  renderSlot,
  watch,
  withCtx,
  type PropType,
} from 'vue'
import { PRECISION } from '../../../../shared/src/primitives/splitter/constants'
import type { PanelData, SizeUnit } from '../../../../shared/src/primitives/splitter/types'
import { Primitive, type PrimitiveProps } from '../primitive'
import { useId } from '../utils/useId'
import { injectPanelGroupContext } from './context'

export interface SplitterPanelProps {
  collapsedSize?: number
  collapsible?: boolean
  defaultSize?: number
  id?: string
  maxSize?: number
  minSize?: number
  order?: number
  sizeUnit?: SizeUnit
  asChild?: boolean
  as?: PrimitiveProps['as']
}

export type SplitterPanelEmits = {
  collapse: []
  expand: []
  resize: [size: number, prevSize: number | undefined]
}

export const SplitterPanel = defineComponent({
  name: 'SplitterPanel',
  props: {
    collapsedSize: { type: Number, required: false },
    collapsible: { type: Boolean, required: false },
    defaultSize: { type: Number, required: false },
    id: { type: String, required: false },
    maxSize: { type: Number, required: false },
    minSize: { type: Number, required: false },
    order: { type: Number, required: false },
    sizeUnit: { type: String as PropType<SizeUnit>, required: false },
    asChild: { type: Boolean, required: false },
    as: { type: null as unknown as PropType<PrimitiveProps['as']>, required: false },
  },
  emits: ['collapse', 'expand', 'resize'],
  setup(props, { emit, expose, slots }) {
    const panelGroupContext = injectPanelGroupContext()
    if (panelGroupContext === null)
      throw new Error('SplitterPanel components must be rendered within a SplitterGroup container')
    const {
      collapsePanel,
      expandPanel,
      getPanelSize,
      getPanelStyle,
      isPanelCollapsed,
      resizePanel,
      groupId,
      reevaluatePanelConstraints,
      registerPanel,
      unregisterPanel,
    } = panelGroupContext
    const panelId = useId(props.id, 'reka-splitter-panel')

    const panelDataRef = computed<PanelData>(() => ({
      callbacks: {
        onCollapse: () => emit('collapse'),
        onExpand: () => emit('expand'),
        onResize: (...args: [number, number | undefined]) => emit('resize', ...args),
      },
      constraints: {
        collapsedSize:
          props.collapsedSize && Number.parseFloat(props.collapsedSize.toFixed(PRECISION)),
        collapsible: props.collapsible,
        defaultSize: props.defaultSize,
        maxSize: props.maxSize,
        minSize: props.minSize,
        sizeUnit: props.sizeUnit ?? '%',
      },
      id: panelId,
      idIsFromProps: props.id !== undefined,
      order: props.order,
    }))

    watch(
      () => panelDataRef.value.constraints,
      (constraints, prevConstraints) => {
        if (
          prevConstraints.collapsedSize !== constraints.collapsedSize ||
          prevConstraints.collapsible !== constraints.collapsible ||
          prevConstraints.maxSize !== constraints.maxSize ||
          prevConstraints.minSize !== constraints.minSize ||
          prevConstraints.sizeUnit !== constraints.sizeUnit
        )
          reevaluatePanelConstraints(panelDataRef.value, prevConstraints)
      },
      { deep: true },
    )

    onMounted(() => {
      registerPanel(panelDataRef.value)
    })
    onUnmounted(() => {
      unregisterPanel(panelDataRef.value)
    })

    const style = computed(() => getPanelStyle(panelDataRef.value, props.defaultSize))
    const isCollapsed = computed(() => isPanelCollapsed(panelDataRef.value))
    const isExpanded = computed(() => !isCollapsed.value)

    function collapse() {
      collapsePanel(panelDataRef.value)
    }
    function expand() {
      expandPanel(panelDataRef.value)
    }
    function resize(size: number) {
      resizePanel(panelDataRef.value, size)
    }

    expose({
      collapse,
      expand,
      getSize() {
        return getPanelSize(panelDataRef.value)
      },
      resize,
      isCollapsed,
      isExpanded,
    })

    return () =>
      h(
        Primitive,
        {
          id: panelId,
          style: normalizeStyle(style.value),
          as: props.as,
          'as-child': props.asChild,
          'data-panel': '',
          'data-panel-collapsible': props.collapsible || undefined,
          'data-panel-group-id': groupId,
          'data-panel-id': panelId,
          'data-panel-size': Number.parseFloat(`${style.value.flexGrow}`).toFixed(1),
          'data-state': props.collapsible
            ? isCollapsed.value
              ? 'collapsed'
              : 'expanded'
            : undefined,
        },
        {
          default: withCtx(() => [
            renderSlot(slots, 'default', {
              isCollapsed: isCollapsed.value,
              isExpanded: isExpanded.value,
              expand,
              collapse,
              resize,
            }),
          ]),
        },
      )
  },
})
