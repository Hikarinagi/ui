'use client'

import { useState } from 'react'
import { BookOpen, Clapperboard, Gamepad2, type LucideIcon } from 'lucide-react'
import { Inline, Listbox, Stack, Text, type ListboxValue } from '@hina-ui/react'

const types = [
  { value: 'gal', label: 'Galgame', description: '视觉小说与冒险游戏' },
  { value: 'ln', label: '轻小说', description: '文库本与网络连载' },
  { value: 'anime', label: '动画', description: 'TV、剧场版与 OVA' },
]
const icons: Record<string, LucideIcon> = { gal: Gamepad2, ln: BookOpen, anime: Clapperboard }

export default function Demo() {
  const [type, setType] = useState<ListboxValue>('gal')

  return (
    <Listbox
      value={type}
      onValueChange={setType}
      options={types}
      aria-label="作品类型"
      className="w-64"
      renderOption={({ option }) => {
        const Icon = icons[option.value]!
        return (
          <Inline as="span" gap="sm" wrap={false}>
            <Icon />
            <Stack as="span" gap="none" className="min-w-0">
              <Text as="span">{option.label}</Text>
              <Text as="span" size="xs" tone="muted">
                {option.description}
              </Text>
            </Stack>
          </Inline>
        )
      }}
    />
  )
}
