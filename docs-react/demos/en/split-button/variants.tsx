'use client'

import { useState } from 'react'
import { DropdownMenuItem, Flex, SplitButton, Stack, Text } from '@hina-ui/react'

const variants = ['solid', 'soft', 'outline', 'ghost'] as const

export default function Demo() {
  const [result, setResult] = useState('Each style keeps its primary action separate from the menu')

  return (
    <Stack align="center" gap="lg">
      <Flex wrap justify="center" gap="lg">
        {variants.map(variant => (
          <SplitButton
            key={variant}
            variant={variant}
            menuLabel={`${variant} options`}
            onClick={() => setResult(`${variant}: saved`)}
            renderContent={() => (
              <DropdownMenuItem onSelect={() => setResult(`${variant}: save a copy`)}>
                Save a copy
              </DropdownMenuItem>
            )}
          >
            {variant}
          </SplitButton>
        ))}
      </Flex>
      <Flex wrap justify="center" gap="lg">
        <SplitButton
          tone="neutral"
          menuLabel="Download options"
          onClick={() => setResult('Action: download')}
          renderContent={() => (
            <DropdownMenuItem onSelect={() => setResult('Action: copy link')}>
              Copy link
            </DropdownMenuItem>
          )}
        >
          Download
        </SplitButton>
        <SplitButton
          tone="danger"
          variant="soft"
          menuLabel="Archive options"
          onClick={() => setResult('Action: archive')}
          renderContent={() => (
            <DropdownMenuItem onSelect={() => setResult('Action: move to trash')}>
              Move to trash
            </DropdownMenuItem>
          )}
        >
          Archive
        </SplitButton>
      </Flex>
      <Text role="status" size="sm" tone="muted">
        {result}
      </Text>
    </Stack>
  )
}
