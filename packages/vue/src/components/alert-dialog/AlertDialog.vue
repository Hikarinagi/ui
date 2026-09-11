<script setup lang="ts">
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
  import { useOverlayPortal } from '../../lib/overlay-portal'
  import { cn } from '../../lib/cn'
  import { useUiLocale } from '../../locale'
  import Button from '../button/Button.vue'
  import Card from '../card/Card.vue'
  import { dialogCard, dialogWrapper } from '../dialog/dialog.variants'
  import Heading from '../heading/Heading.vue'
  import Text from '../text/Text.vue'
  import { useAlertDialogConfirm } from './composables/useAlertDialogConfirm'
  import { useConfirmDelay } from './composables/useConfirmDelay'
  import {
    alertDialogHeader,
    alertDialogContent,
    alertDialogActions,
    alertDialogCountdown,
  } from './alert-dialog.variants'

  defineOptions({ name: 'HnAlertDialog' })

  const props = withDefaults(
    defineProps<{
      title: string
      description?: string
      confirmText?: string
      confirmDelay?: number
      cancelText?: string
      tone?: 'accent' | 'danger'
      size?: 'sm' | 'md'
      placement?: 'center' | 'bottom'
      onConfirm?: () => unknown
      class?: string
    }>(),
    { tone: 'accent', size: 'sm', confirmDelay: 0 },
  )
  const emit = defineEmits<{ cancel: []; error: [error: unknown] }>()

  const open = defineModel<boolean>('open')
  const { content, present } = useOverlayPortal(open)
  const t = useUiLocale()
  const remaining = useConfirmDelay(open, () => props.confirmDelay)
  const { busy, guard, confirm } = useAlertDialogConfirm(
    props,
    open,
    error => emit('error', error),
    () => remaining.value > 0,
  )
</script>

<template>
  <AlertDialogRoot v-model:open="open">
    <AlertDialogTrigger v-if="$slots.default" as-child>
      <slot />
    </AlertDialogTrigger>
    <AlertDialogPortal v-if="present">
      <AlertDialogOverlay class="hn-scrim" />
      <div :class="dialogWrapper({ placement: props.placement ?? 'auto' })">
        <AlertDialogContent as-child @escape-key-down="guard">
          <Card
            ref="content"
            :padded="false"
            data-hn-alert-dialog
            :aria-busy="busy || undefined"
            :class="
              cn(
                dialogCard({ placement: props.placement ?? 'auto', size: props.size }),
                props.class,
              )
            "
          >
            <div :class="alertDialogHeader()">
              <AlertDialogTitle as-child>
                <Heading :level="2" size="lg">{{ props.title }}</Heading>
              </AlertDialogTitle>
              <AlertDialogDescription v-if="props.description" as-child>
                <Text tone="muted">{{ props.description }}</Text>
              </AlertDialogDescription>
            </div>
            <div v-if="$slots.content" :class="alertDialogContent()">
              <slot name="content" />
            </div>
            <div :class="alertDialogActions()">
              <AlertDialogCancel as-child>
                <Button variant="soft" tone="neutral" :disabled="busy" @click="emit('cancel')">
                  {{ props.cancelText ?? t.common.cancel }}
                </Button>
              </AlertDialogCancel>
              <Button :tone="props.tone" :loading="busy" :disabled="remaining > 0" @click="confirm">
                {{ props.confirmText ?? t.common.confirm }}
                <span v-if="remaining > 0" :class="alertDialogCountdown()">({{ remaining }})</span>
              </Button>
            </div>
          </Card>
        </AlertDialogContent>
      </div>
    </AlertDialogPortal>
  </AlertDialogRoot>
</template>
