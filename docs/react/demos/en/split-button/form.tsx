'use client'

import { useState } from 'react'
import * as v from 'valibot'
import { DropdownMenuItem, Form, FormField, Input, SplitButton, Text } from '@hina-ui/react'

const schema = v.object({
  title: v.pipe(v.string(), v.trim(), v.minLength(2, 'Enter at least 2 characters')),
})

export default function Demo() {
  const [values, setValues] = useState({ title: '' })
  const [result, setResult] = useState('')

  async function publish(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 800))
    setResult(`Published: ${(data as { title: string }).title}`)
  }
  function saveDraft() {
    setResult(`Draft saved: ${values.title.trim() || 'Untitled article'}`)
  }

  return (
    <Form values={values} rules={schema} className="w-full max-w-sm" onSubmit={publish}>
      {({ submitting }) => (
        <>
          <FormField
            name="title"
            label="Article title"
            description="Publishing validates the title. Saving a draft allows unfinished content."
            required
          >
            <Input
              value={values.title}
              onValueChange={title => setValues({ ...values, title })}
              placeholder="Enter a title"
            />
          </FormField>
          <SplitButton
            type="submit"
            loading={submitting}
            menuLabel="More saving options"
            className="self-start"
            renderContent={() => (
              <DropdownMenuItem onSelect={saveDraft}>Save draft</DropdownMenuItem>
            )}
          >
            Publish article
          </SplitButton>
          {result && (
            <Text role="status" size="sm" tone="muted">
              {result}
            </Text>
          )}
        </>
      )}
    </Form>
  )
}
