'use client'

import { useState } from 'react'
import { DropdownMenuItem, Flex, SplitButton, Stack, Text } from '@hina-ui/react'

const sizes = ['sm', 'md', 'lg'] as const

export default function Demo() {
  const [result, setResult] = useState('菜单按钮始终与主操作等高')

  return (
    <Stack align="center">
      <Flex wrap align="center" justify="center" gap="lg">
        {sizes.map(size => (
          <SplitButton
            key={size}
            size={size}
            menuLabel={`${size} 的更多操作`}
            onClick={() => setResult(`${size}：已保存`)}
            renderContent={() => (
              <DropdownMenuItem onSelect={() => setResult(`${size}：另存副本`)}>
                另存副本
              </DropdownMenuItem>
            )}
          >
            保存
          </SplitButton>
        ))}
        <SplitButton
          pill
          variant="outline"
          menuLabel="圆角按钮的更多操作"
          onClick={() => setResult('已执行：保存')}
          renderContent={() => (
            <DropdownMenuItem onSelect={() => setResult('已执行：另存副本')}>
              另存副本
            </DropdownMenuItem>
          )}
        >
          圆角按钮
        </SplitButton>
      </Flex>
      <Text role="status" size="sm" tone="muted">
        {result}
      </Text>
    </Stack>
  )
}
