'use client'

import type { ReactNode } from 'react'
import { User } from 'lucide-react'
import { cn } from '../../lib/cn'
import { hasContent } from '../../lib/content'
import { lucide } from '../../lib/icon'
import { Image, type ImageProps } from '../image/Image'
import { avatar, type AvatarVariants } from './avatar.variants'
import { useAvatarGroup } from './context'

const UserIcon = lucide(User)

export interface AvatarProps extends Omit<
  ImageProps,
  'size' | 'empty' | 'error' | 'skeletonContent'
> {
  src?: string
  alt?: string
  name?: string
  size?: AvatarVariants['size']
  className?: string
  children?: ReactNode
}

function initialsOf(value: string | undefined) {
  const name = value?.trim()
  if (!name) return ''
  const words = name.split(/\s+/)
  if (words.length > 1)
    return words
      .slice(0, 2)
      .map(w => w[0]!.toUpperCase())
      .join('')
  return /^[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u.test(name)
    ? name[0]!
    : name.slice(0, 2).toUpperCase()
}

export function Avatar({
  src,
  alt,
  name,
  size: sizeProp,
  className,
  children,
  ...attrs
}: AvatarProps) {
  const group = useAvatarGroup()
  const size = sizeProp ?? group?.size
  const initials = initialsOf(name)
  const fallback = hasContent(children) ? (
    children
  ) : initials ? (
    initials
  ) : (
    <UserIcon aria-hidden="true" />
  )

  return (
    <Image
      src={src}
      alt={alt ?? name ?? ''}
      className={cn(avatar({ size }), className)}
      {...attrs}
      empty={fallback}
      error={fallback}
    />
  )
}
