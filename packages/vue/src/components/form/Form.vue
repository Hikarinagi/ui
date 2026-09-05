<script setup lang="ts">
  import { computed, shallowRef, watch } from 'vue'
  import { cn } from '../../lib/cn'
  import { useForm, type FormValidateOn } from './composables/useForm'
  import { provideForm } from './context'
  import { formRoot } from './form.variants'
  import { focusFirstInvalid } from './utils/focus'
  import type { FormErrors, FormRules, FormValues } from './standard-schema'

  defineOptions({ name: 'HnForm' })

  const props = withDefaults(
    defineProps<{
      values: FormValues
      rules?: FormRules
      validateOn?: FormValidateOn
      disabled?: boolean
      onSubmit?: (values: FormValues) => unknown
      class?: string
    }>(),
    { validateOn: 'submit' },
  )

  const root = shallowRef<HTMLFormElement | null>(null)

  const form = useForm({
    values: () => props.values,
    rules: () => props.rules,
    validateOn: () => props.validateOn,
  })

  watch(() => props.values, form.onChange, { deep: true })

  provideForm({
    errors: form.errors,
    disabled: computed(() => !!props.disabled || form.submitting.value),
    touch: form.touch,
  })

  async function submit() {
    if (props.disabled || form.submitting.value) return
    const ok = await form.submit(props.onSubmit)
    if (!ok && root.value) focusFirstInvalid(root.value)
  }

  function setErrors(errors: FormErrors) {
    form.setErrors(errors)
  }

  defineExpose({ submit, validate: form.validate, reset: form.reset, setErrors })
</script>

<template>
  <form
    ref="root"
    data-hn-form
    novalidate
    :aria-busy="form.submitting.value || undefined"
    :class="cn(formRoot(), props.class)"
    @submit.prevent="submit"
  >
    <slot
      :errors="form.errors.value"
      :error="form.formError.value"
      :invalid="form.invalid.value"
      :submitting="form.submitting.value"
      :submitted="form.submitted.value"
    />
  </form>
</template>
