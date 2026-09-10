<script setup lang="ts">
  import { computed, shallowRef, useId, useSlots } from 'vue'
  import { cn } from '../../lib/cn'
  import { injectForm, provideForm } from '../form/context'
  import type { FormFieldLayoutProps } from '../form-field/types'
  import { provideFormLayout, useFormFieldLayout } from './context'
  import type { FormErrors } from '../form/standard-schema'
  import {
    formLayoutDescription,
    formLayoutGrid,
    formLayoutLegend,
    formLayoutRoot,
    type FormLayoutVariants,
  } from './form-layout.variants'

  defineOptions({ name: 'HnFormLayout' })

  const props = withDefaults(
    defineProps<
      FormFieldLayoutProps & {
        legend?: string
        description?: string
        columns?: FormLayoutVariants['columns']
        disabled?: boolean
        class?: string
      }
    >(),
    { columns: 1 },
  )

  provideFormLayout(useFormFieldLayout(props))

  const slots = useSlots()
  const form = injectForm()
  const descriptionId = useId()

  const headed = computed(() => !!props.legend || !!slots.legend)
  const described = computed(() => !!props.description || !!slots.description)
  const disabled = computed(() => !!props.disabled || !!form?.disabled.value)

  provideForm({
    errors: form?.errors ?? shallowRef<FormErrors>({}),
    disabled,
    touch: form?.touch ?? (() => {}),
  })
</script>

<template>
  <fieldset
    data-hn-form-layout
    :disabled="disabled || undefined"
    :aria-describedby="described ? descriptionId : undefined"
    :class="cn(formLayoutRoot(), props.class)"
  >
    <legend v-if="headed" :class="formLayoutLegend()">
      <slot name="legend">{{ props.legend }}</slot>
    </legend>
    <p v-if="described" :id="descriptionId" :class="formLayoutDescription()">
      <slot name="description">{{ props.description }}</slot>
    </p>
    <div :class="formLayoutGrid({ columns: props.columns, headed: headed || described })">
      <slot />
    </div>
  </fieldset>
</template>
