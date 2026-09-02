<script setup lang="ts">
  import { computed, useSlots } from 'vue'
  import { cn } from '../../lib/cn'
  import { useCollapseHooks } from '../../lib/collapse'
  import CloseButton from '../close-button/CloseButton.vue'
  import { callout, calloutIcon, type CalloutVariants } from '../callout/callout.variants'
  import { calloutIcons } from '../callout/icons'

  defineOptions({ name: 'HnAlert' })

  const props = withDefaults(
    defineProps<{
      tone?: CalloutVariants['tone']
      title?: string
      icon?: boolean
      closable?: boolean
      class?: string
    }>(),
    { tone: 'neutral', icon: true },
  )

  const open = defineModel<boolean>('open', { default: true })

  const emit = defineEmits<{ close: [] }>()

  const slots = useSlots()
  const hooks = useCollapseHooks()

  const role = computed(() =>
    props.tone === 'danger' || props.tone === 'warning' ? 'alert' : 'status',
  )

  function close() {
    open.value = false
    emit('close')
  }
</script>

<template>
  <Transition
    enter-from-class="hn-collapse-closed"
    enter-to-class="hn-collapse-open"
    leave-from-class="hn-collapse-open"
    leave-to-class="hn-collapse-closed"
    v-on="hooks"
  >
    <div v-if="open" data-hn-alert class="hn-collapse">
      <div class="hn-collapse-body">
        <div :role="role" :class="cn(callout({ tone: props.tone }), props.class)">
          <slot name="icon">
            <component
              :is="calloutIcons[props.tone]"
              v-if="props.icon"
              :class="calloutIcon({ tone: props.tone })"
              aria-hidden="true"
            />
          </slot>
          <div class="flex min-w-0 flex-1 flex-col gap-1">
            <p v-if="props.title" class="text-fg font-medium">{{ props.title }}</p>
            <slot />
          </div>
          <div v-if="slots.actions" class="flex shrink-0 items-center gap-2 self-center">
            <slot name="actions" />
          </div>
          <CloseButton v-if="props.closable" size="sm" class="-my-0.5 -me-1" @click="close" />
        </div>
      </div>
    </div>
  </Transition>
</template>
