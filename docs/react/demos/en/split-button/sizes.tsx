'use client'

import { useState } from 'react'
import { DropdownMenuItem, Flex, SplitButton, Stack, Text } from '@hina-ui/react'

const sizes = ['sm', 'md', 'lg'] as const

export default function Demo() {
  const [result, setResult] = useState('Both buttons share the same height')

  return (
    <Stack align="center">
      <Flex wrap align="center" justify="center" gap="lg">
        {sizes.map(size => (
          <SplitButton
            key={size}
            size={size}
            menuLabel={`${size} options`}
            onClick={() => setResult(`${size}: saved`)}
            renderContent={() => (
              <DropdownMenuItem onSelect={() => setResult(`${size}: save a copy`)}>
                Save a copy
              </DropdownMenuItem>
            )}
          >
            Save
          </SplitButton>
        ))}
        <SplitButton
          pill
          variant="outline"
          menuLabel="Rounded button options"
          onClick={() => setResult('Action: save')}
          renderContent={() => (
            <DropdownMenuItem onSelect={() => setResult('Action: save a copy')}>
              Save a copy
            </DropdownMenuItem>
          )}
        >
          Rounded
        </SplitButton>
      </Flex>
      <Text role="status" size="sm" tone="muted">
        {result}
      </Text>
    </Stack>
  )
}
