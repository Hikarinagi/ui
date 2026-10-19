'use client'

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ImgHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react'
import { cn } from '../../lib/cn'
import { useRequiredLabel } from '../../lib/a11y'
import { hasContent } from '../../lib/content'
import { Primitive } from '../../lib/primitive'
import { Skeleton } from '../skeleton/Skeleton'
import { Lightbox } from '../lightbox/Lightbox'
import type { LightboxItem } from '../lightbox/types'
import {
  image,
  imageFrame,
  imagePlaceholder,
  imageRoot,
  type ImageVariants,
} from './image.variants'
import { useImage } from './hooks/useImage'
import { useImageGroup } from './context'
import { useImageResolver } from './resolver'

export interface ImageProps extends Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  'src' | 'alt' | 'draggable' | 'className' | 'style' | 'onLoad' | 'onError'
> {
  src?: string
  alt?: string
  fallback?: string
  thumbhash?: string
  fit?: ImageVariants['fit']
  ratio?: number
  lazy?: boolean
  rootMargin?: string
  skeleton?: boolean
  eager?: boolean
  preview?: boolean | string
  previewSize?: LightboxItem['previewSize']
  draggable?: boolean
  className?: string
  style?: CSSProperties
  imageClass?: string
  imageStyle?: CSSProperties
  onLoad?: (size: { width: number; height: number }) => void
  onError?: () => void
  empty?: ReactNode
  error?: ReactNode
  skeletonContent?: ReactNode
  [attribute: `data-${string}`]: string | undefined
}

export function Image({
  src: srcProp,
  alt = '',
  fallback: fallbackProp,
  thumbhash,
  fit = 'cover',
  ratio,
  lazy = true,
  rootMargin = '200px',
  skeleton = true,
  eager = false,
  preview = false,
  previewSize,
  draggable = false,
  className,
  style,
  imageClass,
  imageStyle,
  onLoad,
  onError,
  empty,
  error,
  skeletonContent,
  ...attrs
}: ImageProps) {
  const {
    rootRef,
    imageRef,
    imageEl,
    skeletonRef,
    src,
    placeholder,
    revealed,
    failed,
    showImage,
    showSkeleton,
  } = useImage(
    {
      src: srcProp,
      fallback: fallbackProp,
      thumbhash,
      lazy,
      rootMargin,
      skeleton,
      fit,
      imageClass,
      imageStyle,
    },
    { load: onLoad, error: onError },
  )

  useRequiredLabel('Image', !preview || !!alt, '替代文本')

  const resolve = useImageResolver()
  const [previewOpen, setPreviewOpen] = useState(false)
  const previewId = useId()
  const previewSource = preview
    ? typeof preview === 'string'
      ? preview
      : (srcProp ?? '')
    : undefined
  const previewSrc = useMemo(
    () => (previewSource === undefined ? undefined : resolve(previewSource, 'preview')),
    [previewSource, resolve],
  )
  const previewItem = useMemo<LightboxItem>(
    () => ({
      id: previewId,
      src: src ?? '',
      preview: previewSrc,
      previewSize,
      alt,
      fit,
      source: () => imageEl.current,
    }),
    [previewId, src, previewSrc, previewSize, alt, fit, imageEl],
  )
  const previewItems = useMemo(() => [previewItem], [previewItem])
  const latestItem = useRef(previewItem)
  latestItem.current = previewItem

  const group = useImageGroup()
  const previewOn = !!preview

  useEffect(() => {
    if (!group || !previewOn) return
    group.register(previewId, () => latestItem.current)
    return () => group.unregister(previewId)
  }, [group, previewOn, previewId, previewItem])

  function openPreview(event: MouseEvent<HTMLElement>) {
    if (!(event.target instanceof Node) || !event.currentTarget.contains(event.target)) return
    if (!preview || !showImage || !src) return
    if (group) group.open(previewId)
    else setPreviewOpen(true)
  }

  const framed = !!placeholder && showImage
  const picture = (
    <img
      ref={imageRef}
      {...attrs}
      style={imageStyle}
      src={src}
      alt={alt}
      decoding={eager ? 'sync' : 'async'}
      fetchPriority={eager ? 'high' : undefined}
      draggable={draggable}
      className={cn(
        image({ fit, lazy, placeholder: !!placeholder }),
        lazy && !revealed && 'opacity-0',
        lazy && revealed && placeholder && showSkeleton && 'mix-blend-plus-lighter',
        imageClass,
      )}
    />
  )

  return (
    <Primitive
      ref={rootRef}
      as={preview ? 'button' : 'span'}
      {...(preview ? { type: 'button' } : {})}
      className={cn(imageRoot({ preview: !!preview }), className)}
      style={{ ...(ratio ? { aspectRatio: String(ratio) } : {}), ...style }}
      onClick={openPreview}
    >
      {framed ? (
        <span className={imageFrame()}>
          {picture}
          {showSkeleton && (
            <span
              ref={skeletonRef}
              aria-hidden="true"
              className={cn(
                'pointer-events-none absolute inset-0',
                imagePlaceholder({ fit }),
                revealed && 'will-change-transform',
              )}
              style={{ backgroundImage: `url("${placeholder}")` }}
            />
          )}
        </span>
      ) : showImage ? (
        picture
      ) : failed ? (
        error
      ) : (
        empty
      )}
      {showSkeleton && !framed && (
        <span ref={skeletonRef} aria-hidden="true" className="pointer-events-none absolute inset-0">
          {hasContent(skeletonContent) ? (
            skeletonContent
          ) : (
            <Skeleton className="size-full rounded-none" />
          )}
        </span>
      )}
      {preview && !group && (
        <Lightbox open={previewOpen} onOpenChange={setPreviewOpen} items={previewItems} />
      )}
    </Primitive>
  )
}
