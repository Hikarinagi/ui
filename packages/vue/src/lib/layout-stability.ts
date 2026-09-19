import { computed, inject, provide, type InjectionKey, type Ref } from 'vue'

const key: InjectionKey<Readonly<Ref<boolean>>> = Symbol('hn-layout-transition')

export function provideLayoutTransition(transitioning: Readonly<Ref<boolean>>) {
  const parent = useLayoutTransition()
  provide(key, parent ? computed(() => parent.value || transitioning.value) : transitioning)
}

export function useLayoutTransition() {
  return inject(key, undefined)
}
