<script setup lang="ts">
  import { computed, ref, shallowRef, useId, useSlots } from 'vue'
  import { cn } from '../../lib/cn'
  import { collapseHooks } from '../../lib/collapse'
  import { useUiLocale } from '../../locale'
  import VisuallyHidden from '../visually-hidden/VisuallyHidden.vue'
  import { injectForm } from '../form/context'
  import { provideFormField } from './context'
  import {
    formFieldDescription,
    formFieldLabel,
    formFieldMark,
    formFieldMessage,
    formFieldRoot,
  } from './form-field.variants'

  defineOptions({ name: 'HnFormField' })

  const props = defineProps<{
    name?: string
    label?: string
    description?: string
    error?: string
    required?: boolean
    disabled?: boolean
    class?: string
  }>()

  const slots = useSlots()
  const t = useUiLocale()
  const form = injectForm()

  const root = shallowRef<HTMLElement | null>(null)
  const hooks = collapseHooks('y', () => root.value)

  const id = useId()
  const labelId = useId()
  const descriptionId = useId()
  const messageId = useId()
  const controlId = ref(id)

  const message = computed(
    () => props.error || (props.name ? form?.errors.value[props.name] : undefined),
  )
  const invalid = computed(() => !!message.value)
  const disabled = computed(() => !!props.disabled || !!form?.disabled.value)
  const described = computed(() => !!props.description || !!slots.description)
  const describedBy = computed(() => {
    const ids = []
    if (described.value) ids.push(descriptionId)
    if (invalid.value) ids.push(messageId)
    return ids.length ? ids.join(' ') : undefined
  })

  provideFormField({ id, labelId, controlId, name: props.name, invalid, disabled, describedBy })

  function onFocusOut() {
    if (props.name) form?.touch(props.name)
  }
</script>

<template>
  <div
    ref="root"
    data-hn-form-field
    :data-invalid="invalid ? '' : undefined"
    :data-disabled="disabled ? '' : undefined"
    :class="cn(formFieldRoot(), props.class)"
    @focusout="onFocusOut"
  >
    <label
      v-if="props.label || slots.label"
      :id="labelId"
      :for="controlId"
      :class="formFieldLabel({ disabled })"
    >
      <slot name="label">{{ props.label }}</slot>
      <span v-if="props.required" :class="formFieldMark()" aria-hidden="true">*</span>
      <VisuallyHidden v-if="props.required">{{ t.form.required }}</VisuallyHidden>
    </label>
    <slot />
    <p v-if="described" :id="descriptionId" :class="formFieldDescription()">
      <slot name="description">{{ props.description }}</slot>
    </p>
    <Transition
      enter-from-class="hn-collapse-closed"
      enter-to-class="hn-collapse-open"
      leave-from-class="hn-collapse-open"
      leave-to-class="hn-collapse-closed"
      v-on="hooks"
    >
      <div
        v-if="message"
        data-hn-form-field-message
        class="hn-collapse [--hn-collapse-out:var(--hn-duration-fast)]"
      >
        <div class="hn-collapse-body">
          <p :id="messageId" :class="formFieldMessage()" aria-live="polite">{{ message }}</p>
        </div>
      </div>
    </Transition>
  </div>
</template>
