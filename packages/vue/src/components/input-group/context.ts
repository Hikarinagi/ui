import { inject, provide, type ComputedRef, type InjectionKey } from 'vue'
import type { InputVariants } from '../input/input.variants'

export interface InputGroupContext {
  size: ComputedRef<InputVariants['size']>
  disabled: ComputedRef<boolean>
  invalid: ComputedRef<boolean>
}

const INPUT_GROUP_KEY = Symbol('hn-input-group') as InjectionKey<InputGroupContext>

export function provideInputGroup(context: InputGroupContext) {
  provide(INPUT_GROUP_KEY, context)
}

export function injectInputGroup() {
  return inject(INPUT_GROUP_KEY, null)
}
