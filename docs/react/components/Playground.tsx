'use client'

import { useState, type ComponentType, type ReactNode } from 'react'
import { Card, Center, CodeBlock, Inline } from '@hina-ui/react'
import { initialValue, playgroundCode, type PlaygroundControl } from '~/lib/blocks'
import { PropPicker } from './PropPicker'

export interface PlaygroundProps {
  name: string
  label?: string
  controls: PlaygroundControl[]
}

export function Playground({
  name,
  label,
  controls,
  component: Subject,
}: PlaygroundProps & { component: ComponentType<{ children?: ReactNode }> }) {
  const [state, setState] = useState<Record<string, string | boolean>>(() =>
    Object.fromEntries(controls.map(control => [control.prop, initialValue(control)])),
  )

  return (
    <Card padded={false} className="overflow-hidden">
      <Inline gap="sm" className="border-line border-b px-3 py-2">
        {controls.map(control => (
          <PropPicker
            key={control.prop}
            label={control.prop}
            options={control.options}
            value={state[control.prop]!}
            onValueChange={value => setState(current => ({ ...current, [control.prop]: value }))}
          />
        ))}
      </Inline>
      <Center className="min-h-80 p-10">{Subject && <Subject {...state}>{label}</Subject>}</Center>
      <CodeBlock
        code={playgroundCode(name, label, controls, state)}
        lang="tsx"
        className="border-line border-t [&_.hn-pre]:rounded-none [&_.hn-pre]:border-0"
      />
    </Card>
  )
}
