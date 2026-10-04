'use client'

import { useState } from 'react'
import { Stepper, Button, Card, FormField, Input, Inline, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const items = [{ title: '步骤 A', error: !!error }, { title: '步骤 B' }, { title: '步骤 C' }]

  async function beforeChange(step: number, previousStep: number) {
    if (step <= previousStep || previousStep !== 1) return true
    await new Promise(resolve => setTimeout(resolve, 700))
    const message = name.trim() ? '' : '请填写名称'
    setError(message)
    return !message
  }

  return (
    <Stepper items={items} beforeChange={beforeChange}>
      {({ step, next, prev, pending, canNext, canPrev }) => (
        <Card>
          <Stack gap="lg">
            {step === 1 ? (
              <FormField label="名称" error={error}>
                <Input value={name} onValueChange={setName} disabled={pending} />
              </FormField>
            ) : (
              <Text>第 {step} 步</Text>
            )}
            <Inline justify="between">
              <Button variant="outline" tone="neutral" disabled={!canPrev} onClick={prev}>
                上一步
              </Button>
              <Button loading={pending} disabled={!canNext} onClick={next}>
                下一步
              </Button>
            </Inline>
          </Stack>
        </Card>
      )}
    </Stepper>
  )
}
