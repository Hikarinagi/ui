<script setup lang="ts">
  import { computed, shallowRef } from 'vue'
  import { File as FileIcon, Upload, X } from '@lucide/vue'
  import { cn } from '../../lib/cn'
  import { useFieldControl } from '../form-field/context'
  import { useUiLocale } from '../../locale'
  import Button from '../button/Button.vue'
  import IconSlot from '../button/IconSlot.vue'
  import IconButton from '../icon-button/IconButton.vue'
  import Text from '../text/Text.vue'
  import { useFileDrop } from './composables/useFileDrop'
  import { useObjectUrls } from './composables/useObjectUrls'
  import {
    fileUploadArea,
    fileUploadItem,
    fileUploadList,
    fileUploadMeta,
    fileUploadRoot,
    fileUploadThumb,
  } from './file-upload.variants'
  import { selectFiles, type FileUploadRejection } from './utils/select'
  import { formatSize } from './utils/size'

  defineOptions({ name: 'HnFileUpload', inheritAttrs: false })

  const props = withDefaults(
    defineProps<{
      multiple?: boolean
      accept?: string
      maxSize?: number
      maxFiles?: number
      variant?: 'area' | 'button'
      list?: boolean
      preview?: boolean
      name?: string
      loading?: boolean
      disabled?: boolean
      invalid?: boolean
      class?: string
    }>(),
    { variant: 'area', list: true, preview: true },
  )
  const emit = defineEmits<{ reject: [rejections: FileUploadRejection[]] }>()

  const model = defineModel<File | File[] | null>({ default: null })

  const t = useUiLocale()
  const input = shallowRef<HTMLInputElement | null>(null)

  const {
    field,
    id: fieldId,
    invalid,
    disabled,
    describedBy,
  } = useFieldControl({
    invalid: () => props.invalid,
    disabled: () => !!props.disabled || !!props.loading,
  })
  const files = computed<File[]>(() =>
    Array.isArray(model.value) ? model.value : model.value ? [model.value] : [],
  )

  function commit(next: File[]) {
    model.value = props.multiple ? next : (next[0] ?? null)
  }

  function take(incoming: File[]) {
    const { next, rejected } = selectFiles(files.value, incoming, {
      accept: props.accept,
      maxSize: props.maxSize,
      maxFiles: props.maxFiles,
      multiple: props.multiple,
    })
    if (rejected.length) emit('reject', rejected)
    commit(next)
  }

  function remove(file: File) {
    commit(files.value.filter(item => item !== file))
  }

  function browse() {
    if (!disabled.value) input.value?.click()
  }

  const { dragging, onDragEnter, onDragOver, onDragLeave, onDrop, onChange } = useFileDrop(
    disabled,
    take,
  )
  const { urls } = useObjectUrls(
    files,
    computed(() => props.preview),
  )
</script>

<template>
  <div data-hn-file-upload :class="cn(fileUploadRoot(), props.class)">
    <input
      ref="input"
      type="file"
      class="hidden"
      tabindex="-1"
      aria-hidden="true"
      :name="props.name"
      :accept="props.accept"
      :multiple="props.multiple"
      :disabled="disabled"
      @change="onChange"
    />
    <button
      v-if="props.variant === 'area'"
      v-bind="$attrs"
      type="button"
      data-hn-file-upload-area
      :id="fieldId"
      :aria-describedby="describedBy"
      :aria-invalid="invalid || undefined"
      :data-dragging="dragging ? '' : undefined"
      :data-invalid="invalid ? '' : undefined"
      :aria-busy="props.loading || undefined"
      :disabled="disabled"
      :class="fileUploadArea()"
      @click="browse"
      @dragenter="onDragEnter"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
    >
      <IconSlot
        box-class="relative inline-flex size-6 items-center justify-center [&>svg]:size-6"
        :swapped="!!props.loading"
        spinner-size="md"
      >
        <slot name="icon">
          <Upload aria-hidden="true" />
        </slot>
      </IconSlot>
      <slot>{{ t.upload.dropHint }}</slot>
    </button>
    <Button
      v-else
      v-bind="$attrs"
      :id="fieldId"
      :aria-describedby="describedBy"
      :aria-invalid="invalid || undefined"
      variant="outline"
      tone="neutral"
      :loading="props.loading"
      :disabled="props.disabled || !!field?.disabled.value"
      class="self-start"
      @click="browse"
    >
      <slot name="icon">
        <Upload />
      </slot>
      <slot>{{ t.upload.choose }}</slot>
    </Button>
    <ul v-if="props.list && files.length" :class="fileUploadList()">
      <li
        v-for="file in files"
        :key="`${file.name}-${file.size}-${file.lastModified}`"
        :class="fileUploadItem()"
      >
        <span :class="fileUploadThumb()">
          <img v-if="urls.get(file)" :src="urls.get(file)" alt="" />
          <FileIcon v-else aria-hidden="true" />
        </span>
        <span :class="fileUploadMeta()">
          <Text as="span" size="sm" truncate>{{ file.name }}</Text>
          <Text as="span" size="xs" tone="muted">{{ formatSize(t.tag, file.size) }}</Text>
        </span>
        <IconButton
          variant="ghost"
          tone="neutral"
          size="sm"
          :label="t.upload.removeFile(file.name)"
          :disabled="disabled"
          @click="remove(file)"
        >
          <X />
        </IconButton>
      </li>
    </ul>
  </div>
</template>
