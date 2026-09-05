import { inject, provide, type ComputedRef, type InjectionKey, type Ref } from 'vue'
import type { FormErrors } from './standard-schema'

export interface FormContext {
  errors: Ref<FormErrors>
  disabled: ComputedRef<boolean>
  touch: (name: string) => void
}

const FORM_KEY = Symbol('hn-form') as InjectionKey<FormContext>

export function provideForm(context: FormContext) {
  provide(FORM_KEY, context)
}

export function injectForm() {
  return inject(FORM_KEY, null)
}
