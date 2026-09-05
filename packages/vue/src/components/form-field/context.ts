import {
  computed,
  inject,
  provide,
  useAttrs,
  watchEffect,
  type ComputedRef,
  type InjectionKey,
  type Ref,
} from 'vue'

export interface FormFieldContext {
  id: string
  labelId: string
  controlId: Ref<string>
  name: string | undefined
  invalid: ComputedRef<boolean>
  disabled: ComputedRef<boolean>
  describedBy: ComputedRef<string | undefined>
}

const FORM_FIELD_KEY = Symbol('hn-form-field') as InjectionKey<FormFieldContext | null>

export function provideFormField(context: FormFieldContext) {
  provide(FORM_FIELD_KEY, context)
}

export function shieldFormField() {
  provide(FORM_FIELD_KEY, null)
}

export function injectFormField() {
  return inject(FORM_FIELD_KEY, null)
}

interface Own {
  invalid?: () => boolean | undefined
  disabled?: () => boolean | undefined
}

export function useFieldControl(own: Own = {}) {
  const attrs = useAttrs()
  const field = injectFormField()
  const id = computed(() => (attrs.id as string | undefined) ?? field?.id)
  const labelledBy = computed(
    () =>
      (attrs['aria-labelledby'] as string | undefined) ??
      (attrs['aria-label'] ? undefined : field?.labelId),
  )
  const invalid = computed(() => !!own.invalid?.() || !!field?.invalid.value)
  const disabled = computed(() => !!own.disabled?.() || !!field?.disabled.value)
  const describedBy = computed(() => {
    const parts = [attrs['aria-describedby'], field?.describedBy.value].filter(Boolean)
    return parts.length ? parts.join(' ') : undefined
  })
  if (field) {
    watchEffect(() => {
      field.controlId.value = id.value ?? field.id
    })
  }
  return { field, id, labelledBy, invalid, disabled, describedBy }
}
