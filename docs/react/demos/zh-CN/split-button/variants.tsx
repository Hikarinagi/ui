'use client'

import { useState } from 'react'
import { DropdownMenuItem, Flex, SplitButton, Stack, Text } from '@hina-ui/react'

const variants = ['solid', 'soft', 'outline', 'ghost'] as const

export default function Demo() {
  const [result, setResult] = useState('每种外观都保留独立的主操作和菜单')

  return (
    <Stack align="center" gap="lg">
      <Flex wrap justify="center" gap="lg">
        {variants.map(variant => (
          <SplitButton
            key={variant}
            variant={variant}
            menuLabel={`${variant} 的更多操作`}
            onClick={() => setResult(`${variant}：已保存`)}
            renderContent={() => (
              <DropdownMenuItem onSelect={() => setResult(`${variant}：另存副本`)}>
                另存副本
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
          menuLabel="下载方式"
          onClick={() => setResult('已执行：下载')}
          renderContent={() => (
            <DropdownMenuItem onSelect={() => setResult('已执行：复制链接')}>
              复制链接
            </DropdownMenuItem>
          )}
        >
          下载
        </SplitButton>
        <SplitButton
          tone="danger"
          variant="soft"
          menuLabel="归档方式"
          onClick={() => setResult('已执行：归档')}
          renderContent={() => (
            <DropdownMenuItem onSelect={() => setResult('已执行：移至回收站')}>
              移至回收站
            </DropdownMenuItem>
          )}
        >
          归档
        </SplitButton>
      </Flex>
      <Text role="status" size="sm" tone="muted">
        {result}
      </Text>
    </Stack>
  )
}
