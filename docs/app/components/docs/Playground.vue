<script setup lang="ts">
  import type { Component } from 'vue'
  import * as ui from '@hikarinagi/ui'
  import { Card, Center, CodeBlock, Inline } from '@hikarinagi/ui'

  export interface PlaygroundControl {
    prop: string
    options?: readonly string[]
    default?: string | boolean
  }

  const props = defineProps<{
    name: string
    label?: string
    controls: PlaygroundControl[]
  }>()

  const subject = (ui as unknown as Record<string, Component>)[props.name]

  const initial = (control: PlaygroundControl) =>
    control.default ?? (control.options ? control.options[0] : false)

  const state = reactive<Record<string, string | boolean>>(
    Object.fromEntries(props.controls.map(control => [control.prop, initial(control)!])),
  )

  const code = computed(() => {
    const attrs = props.controls
      .filter(control => state[control.prop] !== initial(control))
      .map(control =>
        typeof state[control.prop] === 'boolean'
          ? ` ${control.prop}`
          : ` ${control.prop}="${state[control.prop]}"`,
      )
      .join('')
    return `<template>\n  <${props.name}${attrs}>${props.label ?? ''}</${props.name}>\n</template>`
  })
</script>

<template>
  <Card :padded="false" class="overflow-hidden">
    <Inline gap="sm" class="border-line border-b px-3 py-2">
      <DocsPropPicker
        v-for="control in props.controls"
        :key="control.prop"
        v-model="state[control.prop]"
        :label="control.prop"
        :options="control.options"
      />
    </Inline>
    <Center class="min-h-80 p-10">
      <component :is="subject" v-bind="state">{{ props.label }}</component>
    </Center>
    <CodeBlock
      :code="code"
      lang="vue"
      class="border-line border-t [&_.hn-pre]:rounded-none [&_.hn-pre]:border-0"
    />
  </Card>
</template>
