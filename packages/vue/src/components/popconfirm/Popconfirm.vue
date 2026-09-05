<script setup lang="ts">
  import { computed, ref, useId } from 'vue'
  import { PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from 'reka-ui'
  import { cn } from '../../lib/cn'
  import { useUiLocale } from '../../locale'
  import Button from '../button/Button.vue'
  import Card from '../card/Card.vue'
  import Text from '../text/Text.vue'

  defineOptions({ name: 'HnPopconfirm' })

  const props = withDefaults(
    defineProps<{
      title: string
      description?: string
      confirmText?: string
      cancelText?: string
      tone?: 'accent' | 'danger'
      side?: 'top' | 'right' | 'bottom' | 'left'
      align?: 'start' | 'center' | 'end'
      sideOffset?: number
      onConfirm?: () => unknown
      class?: string
    }>(),
    { tone: 'accent', side: 'bottom', align: 'center', sideOffset: 8 },
  )
  const emit = defineEmits<{ cancel: [] }>()

  const open = defineModel<boolean>('open')
  const busy = ref(false)
  const t = useUiLocale()
  const titleId = useId()
  const descriptionId = useId()

  const pressOrigin = computed(() => {
    if (props.side === 'left') return 'right'
    if (props.side === 'right') return 'left'
    if (props.align === 'start') return 'left'
    if (props.align === 'end') return 'right'
    return 'center'
  })

  function guard(event: Event) {
    if (busy.value) event.preventDefault()
  }

  function cancel() {
    emit('cancel')
    open.value = false
  }

  async function confirm() {
    if (busy.value) return
    const result = props.onConfirm?.()
    if (result instanceof Promise) {
      busy.value = true
      try {
        await result
      } finally {
        busy.value = false
      }
    }
    open.value = false
  }
</script>

<template>
  <PopoverRoot v-model:open="open" modal>
    <PopoverTrigger as-child :style="{ transformOrigin: pressOrigin }">
      <slot />
    </PopoverTrigger>
    <PopoverPortal>
      <PopoverContent
        as-child
        :side="props.side"
        :align="props.align"
        :side-offset="props.sideOffset"
        :aria-describedby="props.description ? `${titleId} ${descriptionId}` : titleId"
        @escape-key-down="guard"
        @interact-outside="guard"
      >
        <Card
          data-hn-popconfirm
          :padded="false"
          :aria-busy="busy || undefined"
          :class="
            cn(
              'hn-anim-pop z-(--hn-z-overlay) flex w-max max-w-xs min-w-56 flex-col gap-2.5 p-3 shadow-md outline-none',
              props.class,
            )
          "
        >
          <div class="flex flex-col gap-0.5">
            <Text :id="titleId" weight="medium">{{ props.title }}</Text>
            <Text v-if="props.description" :id="descriptionId" tone="muted" size="sm">
              {{ props.description }}
            </Text>
          </div>
          <slot name="content" />
          <div class="flex justify-end gap-2">
            <Button size="sm" variant="soft" tone="neutral" :disabled="busy" @click="cancel">
              {{ props.cancelText ?? t.common.cancel }}
            </Button>
            <Button size="sm" :tone="props.tone" :loading="busy" @click="confirm">
              {{ props.confirmText ?? t.common.confirm }}
            </Button>
          </div>
        </Card>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
