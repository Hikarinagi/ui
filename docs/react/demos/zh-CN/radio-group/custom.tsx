'use client'

import { useState } from 'react'
import { Monitor, Moon, Sun } from 'lucide-react'
import { Inline, RadioGroup } from '@hina-ui/react'

const icons = { light: Sun, dark: Moon, system: Monitor }
const options = [
  { value: 'light', label: '浅色' },
  { value: 'dark', label: '深色' },
  { value: 'system', label: '跟随系统' },
]

export default function Demo() {
  const [theme, setTheme] = useState<string | number | null | undefined>('light')

  return (
    <RadioGroup
      value={theme}
      onValueChange={setTheme}
      options={options}
      aria-label="主题"
      renderOption={({ option }) => {
        const Icon = icons[option.value as keyof typeof icons]
        return (
          <Inline as="span" gap="xs" align="center">
            <Icon className="text-muted size-4" />
            {option.label}
          </Inline>
        )
      }}
    />
  )
}
