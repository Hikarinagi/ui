'use client'

import { useRef, useState } from 'react'
import { Button, Inline, Input, Text, Tour, type TourStep } from '@hina-ui/react'

const steps: TourStep[] = [
  {
    target: '#tour-interactive-name',
    title: 'Name your project',
    description: 'Type a name in the field, then press Next.',
  },
  {
    target: '#tour-interactive-save',
    title: 'Save',
    description: 'The name shows up in the project list.',
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
    const message = latest.current.trim() ? '' : 'A name is required'
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
          placeholder="Project name"
          className="w-56"
        />
        <Button id="tour-interactive-save">Save</Button>
        <Button variant="ghost" tone="neutral" onClick={() => setOpen(true)}>
          Start tour
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
