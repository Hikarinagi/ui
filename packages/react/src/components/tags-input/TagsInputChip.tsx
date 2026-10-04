'use client'

import type { HTMLAttributes, Ref } from 'react'
import { TagsInputItemText } from '../../primitives/tags-input'
import { Chip } from '../chip/Chip'
import type { ChipVariants } from '../chip/chip.variants'
import { tagsInputChip } from './tags-input.variants'

export interface TagsInputChipProps extends HTMLAttributes<HTMLElement> {
  tag: string
  size: ChipVariants['size']
  disabled?: boolean
  onRemove?: () => void
  ref?: Ref<HTMLElement>
  [attribute: `data-${string}`]: string | undefined
}

export function TagsInputChip({
  tag,
  size,
  disabled,
  onRemove,
  className,
  ...attrs
}: TagsInputChipProps) {
  return (
    <Chip
      {...attrs}
      size={size}
      removable
      disabled={disabled}
      className={className ? `${className} ${tagsInputChip()}` : tagsInputChip()}
      data-state={undefined}
      aria-current={undefined}
      onRemove={() => onRemove?.()}
    >
      <TagsInputItemText asChild>
        <span className="min-w-0 truncate">{tag}</span>
      </TagsInputItemText>
    </Chip>
  )
}
