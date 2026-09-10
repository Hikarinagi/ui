import { computed, inject, provide, type ComputedRef, type InjectionKey } from 'vue'
import type { FormFieldLayoutProps } from '../form-field/types'

type FieldLayout = ComputedRef<Required<FormFieldLayoutProps>>
const FORM_LAYOUT_KEY: InjectionKey<FieldLayout> = Symbol('hn-form-layout')

export function useFormFieldLayout(props: FormFieldLayoutProps): FieldLayout {
  const parent = inject(FORM_LAYOUT_KEY, null)
  return computed(() => ({
    orientation: props.orientation ?? parent?.value.orientation ?? 'vertical',
    descriptionPlacement:
      props.descriptionPlacement ?? parent?.value.descriptionPlacement ?? 'control',
    labelWidth: props.labelWidth ?? parent?.value.labelWidth ?? '10rem',
  }))
}

export function provideFormLayout(layout: FieldLayout) {
  provide(FORM_LAYOUT_KEY, layout)
}
