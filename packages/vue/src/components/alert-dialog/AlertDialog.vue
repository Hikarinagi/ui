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
  import { cn } from '../../lib/cn'
  import { useUiLocale } from '../../locale'
  import Button from '../button/Button.vue'
  import Card from '../card/Card.vue'
  import { dialogCard, dialogWrapper } from '../dialog/dialog.variants'
  import Heading from '../heading/Heading.vue'
  import Text from '../text/Text.vue'
  import { useAlertDialogConfirm } from './composables/useAlertDialogConfirm'
  import {
    alertDialogHeader,
    alertDialogContent,
    alertDialogActions,
  } from './alert-dialog.variants'

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
  const emit = defineEmits<{ cancel: []; error: [error: unknown] }>()

  const open = defineModel<boolean>('open')
  const t = useUiLocale()
  const { busy, guard, confirm } = useAlertDialogConfirm(props, open, error => emit('error', error))
</script>

<template>
  <AlertDialogRoot v-model:open="open">
    <AlertDialogTrigger v-if="$slots.default" as-child>
      <slot />
    </AlertDialogTrigger>
    <AlertDialogPortal>
      <AlertDialogOverlay class="hn-scrim" />
      <div :class="dialogWrapper({ placement: props.placement ?? 'auto' })">
        <AlertDialogContent as-child @escape-key-down="guard">
          <Card
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
