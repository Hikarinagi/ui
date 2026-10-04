import {
  computed,
  defineComponent,
  h,
  inject,
  markRaw,
  provide,
  ref,
  watch,
  watchEffect,
  type Ref,
} from 'vue'
import { COLLECTION_ITEM, orderCollectionItems } from '../../../../shared/src/primitives/collection'
import { Slot } from '../primitive'
import { usePrimitiveElement } from '../utils/usePrimitiveElement'

export interface CollectionItem<ItemData = Record<string, unknown>> {
  ref: HTMLElement
  value?: unknown
  data?: ItemData
}

interface CollectionContext<ItemData> {
  collectionRef: Ref<HTMLElement | undefined>
  itemMap: Ref<Map<HTMLElement, CollectionItem<ItemData>>>
}

export function useCollection<ItemData = Record<string, unknown>>(
  options: { key?: string; isProvider?: boolean } = {},
) {
  const { key = '', isProvider = false } = options
  const injectionKey = `${key}CollectionProvider`
  let context: CollectionContext<ItemData>
  if (isProvider) {
    context = {
      collectionRef: ref<HTMLElement>(),
      itemMap: ref(new Map()) as Ref<Map<HTMLElement, CollectionItem<ItemData>>>,
    }
    provide(injectionKey, context)
  } else context = inject(injectionKey) as CollectionContext<ItemData>

  const getItems = (includeDisabledItem = false) =>
    orderCollectionItems(
      context.collectionRef.value,
      context.itemMap.value.values(),
      includeDisabledItem,
    )

  const CollectionSlot = defineComponent({
    name: 'CollectionSlot',
    inheritAttrs: false,
    setup(_, { slots, attrs }) {
      const { primitiveElement, currentElement } = usePrimitiveElement()
      watch(currentElement, () => {
        context.collectionRef.value = currentElement.value
      })
      return () => h(Slot, { ref: primitiveElement, ...attrs }, slots)
    },
  })

  const CollectionItem = defineComponent({
    name: 'CollectionItem',
    inheritAttrs: false,
    props: { value: { validator: () => true } },
    setup(props, { slots, attrs }) {
      const { primitiveElement, currentElement } = usePrimitiveElement()
      watchEffect(onCleanup => {
        if (currentElement.value) {
          const element = markRaw(currentElement.value)
          context.itemMap.value.set(element, { ref: currentElement.value, value: props.value })
          onCleanup(() => context.itemMap.value.delete(element))
        }
      })
      return () => h(Slot, { ...attrs, [COLLECTION_ITEM]: '', ref: primitiveElement }, slots)
    },
  })

  const reactiveItems = computed(() => Array.from(context.itemMap.value.values()))
  const itemMapSize = computed(() => context.itemMap.value.size)

  return { getItems, reactiveItems, itemMapSize, CollectionSlot, CollectionItem }
}
