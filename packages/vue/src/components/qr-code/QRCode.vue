<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { Check, QrCode, RefreshCw, CircleAlert } from '@lucide/vue'
  import { qrCodeGeometry, qrCodeSize } from '../../../../shared/src/lib/qr-code'
  import { cn } from '../../lib/cn'
  import { useUiLocale } from '../../locale'
  import Button from '../button/Button.vue'
  import Spinner from '../spinner/Spinner.vue'
  import { qrCode, qrCodeSvg, qrCodeStatus } from './qr-code.variants'
  import { exportQRCode } from './export'
  import type { QRCodeProps, QRCodeExportOptions, QRCodeStatusSlot, QRCodeState } from './types'

  defineOptions({ name: 'HnQRCode' })
  const props = withDefaults(defineProps<QRCodeProps>(), {
    size: 192,
    margin: 4,
    logoSize: 32,
    logoMargin: 2,
    status: 'active',
    bordered: true,
  })
  const emit = defineEmits<{ refresh: []; error: [error: Error]; logoError: [event: Event] }>()
  defineSlots<{ status?(props: QRCodeStatusSlot): unknown }>()
  const t = useUiLocale()
  const element = ref<HTMLElement>()
  const svg = ref<SVGSVGElement>()
  const logoFailed = ref(false)
  watch(
    () => props.logo,
    () => {
      logoFailed.value = false
    },
  )
  const size = computed(() => qrCodeSize(props.size))
  const result = computed(() => {
    if (!props.value) return {}
    try {
      return {
        geometry: qrCodeGeometry(
          props.value,
          props.level ?? (props.logo ? 'H' : 'M'),
          props.margin,
        ),
      }
    } catch (error) {
      return { error: error instanceof Error ? error : new Error(String(error)) }
    }
  })
  const state = computed<QRCodeState>(() =>
    props.status !== 'active'
      ? props.status
      : result.value.error
        ? 'error'
        : result.value.geometry
          ? 'active'
          : 'empty',
  )
  const inactive = computed(() => (state.value === 'active' ? 'empty' : state.value))
  watch(
    () => result.value.error,
    error => {
      if (error) emit('error', error)
    },
    { immediate: true },
  )
  const refresh = () => emit('refresh')
  function onLogoError(event: Event) {
    logoFailed.value = true
    emit('logoError', event)
  }
  const logo = computed(() => {
    if (!props.logo || logoFailed.value || !result.value.geometry) return
    const dimension = result.value.geometry.size
    const pixels = Number.isFinite(props.logoSize) ? Math.max(0, props.logoSize) : 32
    if (!pixels) return
    const padding = Number.isFinite(props.logoMargin) ? Math.max(0, props.logoMargin) : 2
    const side = Math.min((pixels / size.value) * dimension, dimension / 4)
    const gap = Math.min((padding / size.value) * dimension, dimension / 32)
    return { side, gap, start: (dimension - side) / 2 }
  })
  async function toBlob(options?: QRCodeExportOptions) {
    if (state.value !== 'active' || !svg.value) throw new Error('No active QR code to export')
    return exportQRCode(svg.value, size.value, options)
  }
  defineExpose({ element, svg, toBlob })
</script>

<template>
  <div
    ref="element"
    data-hn-qr-code
    :data-state="state"
    :aria-busy="state === 'loading' || undefined"
    :class="cn(qrCode({ bordered: props.bordered }), props.class)"
    :style="{
      '--hn-qr-size': `${size}px`,
      '--hn-qr-foreground': props.color,
      '--hn-qr-background': props.background,
    }"
  >
    <svg
      v-if="state === 'active' && result.geometry"
      ref="svg"
      xmlns="http://www.w3.org/2000/svg"
      :width="size"
      :height="size"
      :viewBox="`0 0 ${result.geometry.size} ${result.geometry.size}`"
      role="img"
      :aria-label="props.label ?? t.qrCode.label"
      :class="qrCodeSvg()"
      shape-rendering="crispEdges"
    >
      <rect width="100%" height="100%" fill="var(--hn-qr-background)" />
      <path :d="result.geometry.path" fill="var(--hn-qr-foreground)" />
      <template v-if="logo">
        <rect
          :x="logo.start - logo.gap"
          :y="logo.start - logo.gap"
          :width="logo.side + logo.gap * 2"
          :height="logo.side + logo.gap * 2"
          fill="var(--hn-qr-background)"
        />
        <image
          :href="props.logo"
          :x="logo.start"
          :y="logo.start"
          :width="logo.side"
          :height="logo.side"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
          @error="onLogoError"
        />
      </template>
    </svg>
    <div v-else :class="qrCodeStatus()" role="status" aria-live="polite">
      <slot name="status" :status="inactive" :error="result.error" :refresh="refresh">
        <Spinner v-if="state === 'loading'" size="sm" aria-hidden="true" />
        <Check v-else-if="state === 'scanned'" class="text-success size-6" aria-hidden="true" />
        <CircleAlert v-else-if="state === 'error'" class="size-6" aria-hidden="true" />
        <QrCode v-else class="size-6" aria-hidden="true" />
        <span>{{ inactive === 'loading' ? t.common.loading : t.qrCode[inactive] }}</span>
        <Button
          v-if="state === 'expired'"
          size="sm"
          variant="outline"
          tone="neutral"
          @click="refresh"
        >
          <template #icon><RefreshCw /></template>
          {{ t.qrCode.refresh }}
        </Button>
      </slot>
    </div>
  </div>
</template>
