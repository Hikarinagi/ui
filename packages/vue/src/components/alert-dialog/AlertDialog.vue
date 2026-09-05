<script setup lang="ts">
  import { ref } from 'vue'
  import {
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogOverlay,
    AlertDialogPortal,
    AlertDialogRoot,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from 'reka-ui'
  import { cn } from '../../lib/cn'
  import { useUiLocale } from '../../locale'
  import Button from '../button/Button.vue'
  import Card from '../card/Card.vue'
  import { dialogCard, dialogWrapper } from '../dialog/dialog.variants'
  import Heading from '../heading/Heading.vue'
  import Text from '../text/Text.vue'

  defineOptions({ name: 'HnAlertDialog' })

  const props = withDefaults(
    defineProps<{
      title: string
      description?: string
      confirmText?: string
      cancelText?: string
      tone?: 'accent' | 'danger'
      size?: 'sm' | 'md'
      placement?: 'center' | 'bottom'
      onConfirm?: () => unknown
      class?: string
    }>(),
    { tone: 'accent', size: 'sm' },
  )
  const emit = defineEmits<{ cancel: [] }>()

  const open = defineModel<boolean>('open')
  const busy = ref(false)
  const t = useUiLocale()

  function guard(event: Event) {
    if (busy.value) event.preventDefault()
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
  <AlertDialogRoot v-model:open="open">
    <AlertDialogTrigger v-if="$slots.default" as-child>
      <slot />
    </AlertDialogTrigger>
    <AlertDialogPortal>
      <AlertDialogOverlay class="hn-scrim" />
      <div
        :class="
          cn(
            'pointer-events-none fixed inset-0 z-(--hn-z-overlay) grid',
            dialogWrapper({ placement: props.placement ?? 'auto' }),
          )
        "
      >
        <AlertDialogContent as-child @escape-key-down="guard">
          <Card
            :padded="false"
            data-hn-alert-dialog
            :aria-busy="busy || undefined"
            :class="
              cn(
                'pointer-events-auto flex w-full flex-col gap-4 shadow-lg outline-none',
                'py-(--hn-panel-p)',
                dialogCard({ placement: props.placement ?? 'auto', size: props.size }),
                props.class,
              )
            "
          >
            <div class="flex min-w-0 flex-col gap-1.5 px-(--hn-panel-p)">
              <AlertDialogTitle as-child>
                <Heading :level="2" size="lg">{{ props.title }}</Heading>
              </AlertDialogTitle>
              <AlertDialogDescription v-if="props.description" as-child>
                <Text tone="muted">{{ props.description }}</Text>
              </AlertDialogDescription>
            </div>
            <div v-if="$slots.content" class="px-(--hn-panel-p)">
              <slot name="content" />
            </div>
            <div class="flex justify-end gap-(--hn-inline-gap) px-(--hn-panel-p)">
              <AlertDialogCancel as-child>
                <Button variant="soft" tone="neutral" :disabled="busy" @click="emit('cancel')">
                  {{ props.cancelText ?? t.common.cancel }}
                </Button>
              </AlertDialogCancel>
              <Button :tone="props.tone" :loading="busy" @click="confirm">
                {{ props.confirmText ?? t.common.confirm }}
              </Button>
            </div>
          </Card>
        </AlertDialogContent>
      </div>
    </AlertDialogPortal>
  </AlertDialogRoot>
</template>
