<script setup lang="ts">
  import { shallowRef } from 'vue'
  import { Search, X } from '@lucide/vue'
  import { useUiLocale } from '../../locale'
  import InputAction from '../input/InputAction.vue'
  import { inputAdornment, inputControl, textInputHost } from '../input/input.variants'

  defineOptions({ name: 'HnTreeSelectSearch', inheritAttrs: false })

  const props = defineProps<{ placeholder: string; controls: string }>()
  const emit = defineEmits<{ clear: []; keydown: [event: KeyboardEvent] }>()
  const model = defineModel<string>({ required: true })
  const t = useUiLocale()
  const input = shallowRef<HTMLInputElement | null>(null)

  defineExpose({ focus: () => input.value?.focus() })
</script>

<template>
  <div class="border-line shrink-0 border-b px-1">
    <div :class="textInputHost({ variant: 'bare', size: 'sm' })">
      <span :class="inputAdornment()"><Search /></span>
      <input
        ref="input"
        v-model="model"
        data-hn-tree-select-search
        type="text"
        role="searchbox"
        autocomplete="off"
        :aria-label="props.placeholder"
        :aria-controls="props.controls"
        :placeholder="props.placeholder"
        :class="inputControl({ leading: true, trailing: !!model })"
        @keydown="emit('keydown', $event)"
      />
      <Transition
        enter-active-class="hn-transition-base"
        enter-from-class="scale-90 opacity-0"
        leave-active-class="hn-transition"
        leave-to-class="scale-90 opacity-0"
      >
        <InputAction v-if="model" :label="t.common.clear" @click="emit('clear')">
          <X />
        </InputAction>
      </Transition>
    </div>
  </div>
</template>
