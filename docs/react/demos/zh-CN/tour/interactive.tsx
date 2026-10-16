'use client'

import { useRef, useState } from 'react'
import { Button, Inline, Input, Text, Tour, type TourStep } from '@hina-ui/react'

const steps: TourStep[] = [
  {
    target: '#tour-interactive-name',
    title: '给项目起个名字',
    description: '在输入框里写下名字，再点「下一步」。',
  },
  {
    target: '#tour-interactive-save',
    title: '保存',
    description: '名字会出现在项目列表里。',
    blockTarget: true,
  },
]

export default function Demo() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const latest = useRef(name)
  latest.current = name

  async function beforeChange(next: number, previous: number) {
    if (previous !== 1 || next < previous) return true
    await new Promise(resolve => setTimeout(resolve, 600))
    const message = latest.current.trim() ? '' : '名字不能为空'
    setError(message)
    return !message
  }

  return (
    <>
      <Inline gap="sm" align="center" wrap>
        <Input
          id="tour-interactive-name"
          value={name}
          onValueChange={setName}
          placeholder="项目名称"
          className="w-56"
        />
        <Button id="tour-interactive-save">保存</Button>
        <Button variant="ghost" tone="neutral" onClick={() => setOpen(true)}>
          开始引导
        </Button>
      </Inline>
      <Tour
        steps={steps}
        open={open}
        onOpenChange={setOpen}
        beforeChange={beforeChange}
        onFinish={() => setError('')}
        renderContent={({ step, current }) => (
          <>
            <Text tone="muted" size="sm">
              {step.description}
            </Text>
            {error && current === 1 ? (
              <Text tone="danger" size="sm">
                {error}
              </Text>
            ) : null}
          </>
        )}
      />
    </>
  )
}
