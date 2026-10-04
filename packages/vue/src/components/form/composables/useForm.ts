import { computed, shallowRef } from 'vue'
import { createForm, type FormOptions } from '../../../../../shared/src/behavior/form'

export type { FormValidateOn } from '../../../../../shared/src/behavior/form'

export function useForm(options: FormOptions) {
  const form = createForm(options)
  const version = shallowRef(form.version())
  form.subscribe(() => {
    version.value = form.version()
  })

  function track<T>(read: () => T) {
    return computed(() => {
      void version.value
      return read()
    })
  }

  return {
    errors: track(form.errors),
    formError: track(form.formError),
    invalid: track(form.invalid),
    submitted: track(form.submitted),
    submitting: track(form.submitting),
    validate: form.validate,
    touch: form.touch,
    onChange: form.onChange,
    submit: form.submit,
    setErrors: form.setErrors,
    reset: form.reset,
  }
}
