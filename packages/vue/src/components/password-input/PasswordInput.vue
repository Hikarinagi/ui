<script setup lang="ts">
  import { Eye, EyeOff } from '@lucide/vue'
  import { cn } from '../../lib/cn'
  import { useUiLocale } from '../../locale'
  import InputBase from '../input/InputBase.vue'
  import InputAction from '../input/InputAction.vue'
  import type { InputVariants } from '../input/input.variants'

  defineOptions({ name: 'HnPasswordInput', inheritAttrs: false })

  const props = defineProps<{
    variant?: InputVariants['variant']
    size?: InputVariants['size']
    disabled?: boolean
    invalid?: boolean
    class?: string
  }>()

  const model = defineModel<string>()
  const visible = defineModel<boolean>('visible', { default: false })

  const t = useUiLocale()
</script>

<template>
  <InputBase
    v-bind="$attrs"
    v-model="model"
    :type="visible ? 'text' : 'password'"
    :variant="props.variant"
    :size="props.size"
    :disabled="props.disabled"
    :invalid="props.invalid"
    :class="cn('[&_input::-ms-reveal]:hidden', props.class)"
  >
    <template #action>
      <InputAction
        :label="visible ? t.passwordInput.hide : t.passwordInput.show"
        :disabled="props.disabled"
        @click="visible = !visible"
      >
        <span class="relative inline-flex">
          <Transition
            enter-active-class="hn-transition-base"
            enter-from-class="scale-90 opacity-0"
            leave-active-class="hn-transition absolute"
            leave-to-class="scale-90 opacity-0"
          >
            <EyeOff v-if="visible" key="hide" />
            <Eye v-else key="show" />
          </Transition>
        </span>
      </InputAction>
    </template>
  </InputBase>
</template>
