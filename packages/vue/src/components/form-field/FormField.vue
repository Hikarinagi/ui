<script setup lang="ts">
  import { computed, ref, shallowRef, useId, useSlots } from 'vue'
  import { cn } from '../../lib/cn'
  import { collapseHooks } from '../../lib/collapse'
  import { useUiLocale } from '../../locale'
  import VisuallyHidden from '../visually-hidden/VisuallyHidden.vue'
  import { injectForm } from '../form/context'
  import { provideFormField } from './context'
  import { useFormFieldLayout } from '../form-layout/context'
  import type { FormFieldLayoutProps } from './types'
  import {
    formFieldDescription,
    formFieldLayout,
    formFieldContent,
    formFieldControl,
    formFieldLabel,
    formFieldMark,
    formFieldMessage,
    formFieldRoot,
  } from './form-field.variants'

  defineOptions({ name: 'HnFormField' })

  const props = defineProps<
    FormFieldLayoutProps & {
      name?: string
      label?: string
      description?: string
      error?: string
      required?: boolean
      disabled?: boolean
      class?: string
    }
  >()

  const layout = useFormFieldLayout(props)
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
  const headed = computed(() => !!props.label || !!slots.label)
  const descriptionWithLabel = computed(
    () => described.value && layout.value.descriptionPlacement === 'label',
  )
  const contentOrientation = computed(() =>
    headed.value || descriptionWithLabel.value ? layout.value.orientation : 'vertical',
  )
  const layoutStyle = computed(() => ({
    '--hn-form-label-width':
      typeof layout.value.labelWidth === 'number'
        ? `${layout.value.labelWidth}px`
        : layout.value.labelWidth,
  }))
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
    :data-orientation="layout.orientation"
    :class="cn(formFieldRoot({ orientation: layout.orientation }), props.class)"
    :style="layoutStyle"
    @focusout="onFocusOut"
  >
    <div data-hn-form-field-layout :class="formFieldLayout({ orientation: contentOrientation })">
      <div
        v-if="headed || descriptionWithLabel"
        data-hn-form-field-header
        :class="formFieldContent()"
      >
        <label
          v-if="headed"
          :id="labelId"
          :for="controlId"
          :class="formFieldLabel({ disabled, orientation: contentOrientation })"
        >
          <slot name="label">{{ props.label }}</slot>
          <span v-if="props.required" :class="formFieldMark()" aria-hidden="true">*</span>
          <VisuallyHidden v-if="props.required">{{ t.form.required }}</VisuallyHidden>
        </label>
        <p v-if="descriptionWithLabel" :id="descriptionId" :class="formFieldDescription()">
          <slot name="description">{{ props.description }}</slot>
        </p>
      </div>
      <div data-hn-form-field-body :class="formFieldContent()">
        <div
          data-hn-form-field-control
          :class="formFieldControl({ orientation: contentOrientation })"
        >
          <slot />
        </div>
        <p
          v-if="described && !descriptionWithLabel"
          :id="descriptionId"
          :class="formFieldDescription()"
        >
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
    </div>
  </div>
</template>
