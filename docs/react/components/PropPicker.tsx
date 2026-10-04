'use client'

import { Button, ButtonGroup, Inline, Text } from '@hina-ui/react'

interface PropPickerProps {
  label: string
  options?: readonly string[]
  value: string | boolean
  onValueChange: (value: string | boolean) => void
}

export function PropPicker({ label, options, value, onValueChange }: PropPickerProps) {
  return (
    <Inline gap="xs" className="border-line rounded-md border py-0.5 ps-2.5 pe-0.5">
      <Text as="span" size="xs" tone="muted" className="font-mono">
        {label}
      </Text>
      {options ? (
        <ButtonGroup label={label}>
          {options.map(option => (
            <Button
              key={option}
              size="sm"
              variant={value === option ? 'soft' : 'ghost'}
              tone={value === option ? 'accent' : 'neutral'}
              aria-pressed={value === option}
              onClick={() => onValueChange(option)}
            >
              {option}
            </Button>
          ))}
        </ButtonGroup>
      ) : (
        <Button
          size="sm"
          variant={value ? 'soft' : 'ghost'}
          tone={value ? 'accent' : 'neutral'}
          aria-pressed={!!value}
          onClick={() => onValueChange(!value)}
        >
          {value ? 'true' : 'false'}
        </Button>
      )}
    </Inline>
  )
}
