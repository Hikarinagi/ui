'use client'

import { useState } from 'react'
import { Button, Indicator, Inline, Kbd, Text, Tour, type TourStep } from '@hina-ui/react'

const steps: TourStep[] = [
  { target: '#tour-custom-command', title: '命令面板', description: '随时打开命令面板。' },
  { target: '#tour-custom-theme', title: '主题', description: '在浅色与深色之间切换。' },
]

export default function Demo() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Inline gap="sm" align="center" wrap>
        <Button id="tour-custom-command" variant="outline" tone="neutral">
          命令
        </Button>
        <Button id="tour-custom-theme" variant="outline" tone="neutral">
          主题
        </Button>
        <Button variant="ghost" tone="neutral" onClick={() => setOpen(true)}>
          开始引导
        </Button>
      </Inline>
      <Tour
        steps={steps}
        open={open}
        onOpenChange={setOpen}
        locked
        renderContent={({ step, current }) => (
          <>
            <Text tone="muted" size="sm">
              {step.description}
            </Text>
            {current === 1 ? (
              <Text size="sm" className="mt-2">
                按 <Kbd>⌘</Kbd> <Kbd>K</Kbd> 打开。
              </Text>
            ) : null}
          </>
        )}
        renderFooter={({ current, total, next, prev }) => (
          <Inline gap="sm" align="center" justify="between">
            <Inline gap="xs" aria-hidden="true">
              {Array.from({ length: total }, (_, index) => (
                <Indicator
                  key={index}
                  size="sm"
                  tone={index + 1 === current ? 'accent' : 'neutral'}
                  className={index + 1 === current ? undefined : 'opacity-25'}
                />
              ))}
            </Inline>
            <Inline gap="sm">
              {current > 1 ? (
                <Button size="sm" variant="ghost" tone="neutral" onClick={prev}>
                  返回
                </Button>
              ) : null}
              <Button size="sm" onClick={next}>
                {current === total ? '知道了' : '继续'}
              </Button>
            </Inline>
          </Inline>
        )}
      />
    </>
  )
}
