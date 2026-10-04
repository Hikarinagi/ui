'use client'

import { useState } from 'react'
import * as v from 'valibot'
import { Button, Form, FormField, TagsInput, Text } from '@hina-ui/react'

const schema = v.object({
  aliases: v.pipe(
    v.array(v.pipe(v.string(), v.maxLength(20, 'An alias is at most 20 characters'))),
    v.minLength(1, 'Add at least one alias'),
    v.maxLength(5, 'At most five aliases'),
  ),
})

export default function Demo() {
  const [values, setValues] = useState({ aliases: [] as string[] })
  const [saved, setSaved] = useState('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    setSaved(JSON.stringify(data))
  }

  return (
    <Form values={values} rules={schema} className="w-80" onSubmit={save}>
      {({ submitting }) => (
        <>
          <FormField
            name="aliases"
            label="Aliases"
            description="Press Enter to add, up to five"
            required
          >
            <TagsInput
              value={values.aliases}
              onValueChange={aliases => setValues({ ...values, aliases })}
            />
          </FormField>
          <Button type="submit" loading={submitting} className="self-start">
            Save
          </Button>
          {saved && (
            <Text tone="muted" size="sm">
              Saved: {saved}
            </Text>
          )}
        </>
      )}
    </Form>
  )
}
