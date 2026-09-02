<script setup lang="ts">
  import { Download, RotateCw, Shrink, ZoomIn, ZoomOut } from '@lucide/vue'
  import { useUiLocale } from '../../locale'
  import IconButton from '../icon-button/IconButton.vue'
  import LightboxThumbs from './LightboxThumbs.vue'
  import type { LightboxItem } from './types'

  defineOptions({ name: 'HnLightboxToolbar' })

  const props = defineProps<{
    items: LightboxItem[]
    index: number
    zoomed: boolean
  }>()

  const emit = defineEmits<{
    select: [index: number]
    zoomIn: []
    zoomOut: []
    reset: []
    rotate: []
    download: []
  }>()

  const t = useUiLocale()
</script>

<template>
  <div class="flex flex-col items-center gap-1 pb-3">
    <LightboxThumbs
      v-if="props.items.length > 1"
      :items="props.items"
      :index="props.index"
      @select="emit('select', $event)"
    />
    <div class="flex items-center gap-1">
      <IconButton
        :label="t.lightbox.zoomOut"
        variant="soft"
        pill
        class="hidden pointer-fine:inline-flex"
        @click="emit('zoomOut')"
      >
        <ZoomOut />
      </IconButton>
      <IconButton
        :label="t.lightbox.zoomIn"
        variant="soft"
        pill
        class="hidden pointer-fine:inline-flex"
        @click="emit('zoomIn')"
      >
        <ZoomIn />
      </IconButton>
      <IconButton
        :label="t.lightbox.resetZoom"
        variant="soft"
        pill
        :disabled="!props.zoomed"
        class="hidden pointer-fine:inline-flex"
        @click="emit('reset')"
      >
        <Shrink />
      </IconButton>
      <IconButton :label="t.lightbox.rotate" variant="soft" pill @click="emit('rotate')">
        <RotateCw />
      </IconButton>
      <IconButton :label="t.lightbox.download" variant="soft" pill @click="emit('download')">
        <Download />
      </IconButton>
    </div>
  </div>
</template>
