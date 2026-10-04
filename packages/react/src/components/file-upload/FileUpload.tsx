'use client'

import {
  useRef,
  type ButtonHTMLAttributes,
  type DragEvent,
  type MouseEvent,
  type ReactNode,
} from 'react'
import { File as FileGlyph, Upload, X } from 'lucide-react'
import { useControllableState } from 'radix-ui/internal'
import { cn } from '../../lib/cn'
import { hasContent } from '../../lib/content'
import { lucide } from '../../lib/icon'
import { useUiLocale } from '../../locale'
import { useFieldControl } from '../form-field/context'
import { Button } from '../button/Button'
import { IconSlot } from '../button/IconSlot'
import { IconButton } from '../icon-button/IconButton'
import { Text } from '../text/Text'
import { useFileDrop } from './hooks/useFileDrop'
import { useObjectUrls } from './hooks/useObjectUrls'
import {
  fileUploadArea,
  fileUploadItem,
  fileUploadList,
  fileUploadMeta,
  fileUploadRoot,
  fileUploadThumb,
} from './file-upload.variants'
import {
  selectFiles,
  type FileUploadRejection,
} from '../../../../shared/src/lib/file-upload/select'
import { formatSize } from '../../../../shared/src/lib/file-upload/size'

export type {
  FileUploadReason,
  FileUploadRejection,
} from '../../../../shared/src/lib/file-upload/select'

const UploadIcon = lucide(Upload)
const FileIcon = lucide(FileGlyph)
const XIcon = lucide(X)

type FileUploadValue = File | File[] | null

export interface FileUploadProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'value' | 'defaultValue' | 'onChange' | 'type' | 'children'
> {
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
  value?: FileUploadValue
  defaultValue?: FileUploadValue
  onValueChange?: (value: FileUploadValue) => void
  onReject?: (rejections: FileUploadRejection[]) => void
  icon?: ReactNode
  children?: ReactNode
  [attribute: `data-${string}`]: string | undefined
}

export function FileUpload({
  multiple,
  accept,
  maxSize,
  maxFiles,
  variant = 'area',
  list = true,
  preview = true,
  name,
  loading,
  disabled: disabledProp,
  invalid: invalidProp,
  value,
  defaultValue = null,
  onValueChange,
  onReject,
  icon,
  className,
  children,
  onClick,
  onDragEnter,
  onDragOver,
  onDragLeave,
  onDrop,
  ...attrs
}: FileUploadProps) {
  const t = useUiLocale()
  const input = useRef<HTMLInputElement | null>(null)
  const [model, setModel] = useControllableState<FileUploadValue>({
    prop: value,
    defaultProp: defaultValue,
    onChange: onValueChange,
    caller: 'FileUpload',
  })

  const {
    field,
    id: fieldId,
    invalid,
    disabled,
    describedBy,
  } = useFieldControl({ invalid: invalidProp, disabled: !!disabledProp || !!loading }, attrs)
  const files: File[] = Array.isArray(model) ? model : model ? [model] : []

  function commit(next: File[]) {
    setModel(multiple ? next : (next[0] ?? null))
  }

  function take(incoming: File[]) {
    const { next, rejected } = selectFiles(files, incoming, {
      accept,
      maxSize,
      maxFiles,
      multiple,
    })
    if (rejected.length) onReject?.(rejected)
    commit(next)
  }

  function remove(file: File) {
    commit(files.filter(item => item !== file))
  }

  function browse() {
    if (!disabled) input.current?.click()
  }

  const drop = useFileDrop(disabled, take)
  const { urls } = useObjectUrls(files, preview)

  const iconContent = hasContent(icon) ? icon : null
  const label = hasContent(children) ? children : null

  function onAreaClick(event: MouseEvent<HTMLButtonElement>) {
    onClick?.(event)
    browse()
  }

  return (
    <div data-hn-file-upload="" className={cn(fileUploadRoot(), className)}>
      <input
        ref={input}
        type="file"
        className="hidden"
        tabIndex={-1}
        aria-hidden="true"
        name={name}
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={drop.onChange}
      />
      {variant === 'area' ? (
        <button
          {...attrs}
          type="button"
          data-hn-file-upload-area=""
          id={fieldId}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          data-dragging={drop.dragging ? '' : undefined}
          data-invalid={invalid ? '' : undefined}
          aria-busy={loading || undefined}
          disabled={disabled}
          className={fileUploadArea()}
          onClick={onAreaClick}
          onDragEnter={(event: DragEvent<HTMLButtonElement>) => {
            onDragEnter?.(event)
            drop.onDragEnter(event)
          }}
          onDragOver={(event: DragEvent<HTMLButtonElement>) => {
            onDragOver?.(event)
            drop.onDragOver(event)
          }}
          onDragLeave={(event: DragEvent<HTMLButtonElement>) => {
            onDragLeave?.(event)
            drop.onDragLeave()
          }}
          onDrop={(event: DragEvent<HTMLButtonElement>) => {
            onDrop?.(event)
            drop.onDrop(event)
          }}
        >
          <IconSlot
            boxClass="relative inline-flex size-6 items-center justify-center [&>svg]:size-6"
            swapped={!!loading}
            spinnerSize="md"
          >
            {iconContent ?? <UploadIcon aria-hidden="true" />}
          </IconSlot>
          {label ?? t.upload.dropHint}
        </button>
      ) : (
        <Button
          {...attrs}
          id={fieldId}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          variant="outline"
          tone="neutral"
          loading={loading}
          disabled={!!disabledProp || !!field?.disabled}
          className="self-start"
          onClick={onAreaClick}
        >
          {iconContent ?? <UploadIcon />}
          {label ?? t.upload.choose}
        </Button>
      )}
      {list && files.length > 0 && (
        <ul className={fileUploadList()}>
          {files.map(file => (
            <li key={`${file.name}-${file.size}-${file.lastModified}`} className={fileUploadItem()}>
              <span className={fileUploadThumb()}>
                {urls.get(file) ? (
                  <img src={urls.get(file)} alt="" />
                ) : (
                  <FileIcon aria-hidden="true" />
                )}
              </span>
              <span className={fileUploadMeta()}>
                <Text as="span" size="sm" truncate>
                  {file.name}
                </Text>
                <Text as="span" size="xs" tone="muted">
                  {formatSize(t.tag, file.size)}
                </Text>
              </span>
              <IconButton
                variant="ghost"
                tone="neutral"
                size="sm"
                label={t.upload.removeFile(file.name)}
                disabled={disabled}
                onClick={() => remove(file)}
              >
                <XIcon />
              </IconButton>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
