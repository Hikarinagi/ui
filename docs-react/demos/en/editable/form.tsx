'use client'

import { useState } from 'react'
import * as v from 'valibot'
import { Button, Editable, Form, FormField, Text } from '@hina-ui/react'

const schema = v.object({
  displayName: v.pipe(v.string(), v.trim(), v.minLength(2, 'Use at least 2 characters')),
})

export default function Demo() {
  const [values, setValues] = useState({ displayName: '' })
  const [editing, setEditing] = useState(false)
  const [saved, setSaved] = useState('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    setSaved((data as { displayName: string }).displayName)
  }

  return (
    <Form values={values} rules={schema} className="w-full max-w-sm" onSubmit={save}>
      {({ submitting }) => (
        <>
          <FormField
            name="displayName"
            label="Display name"
            description="Confirm the field edit before saving the profile."
            required
          >
            <Editable
              value={values.displayName}
              onValueChange={displayName => setValues({ ...values, displayName })}
              editing={editing}
              onEditingChange={setEditing}
              name="displayName"
              placeholder="Enter a display name"
            />
          </FormField>
          <Button type="submit" loading={submitting} disabled={editing} className="self-start">
            Save profile
          </Button>
          {saved && (
            <Text role="status" size="sm" tone="muted">
              Saved: {saved}
            </Text>
          )}
        </>
      )}
    </Form>
  )
}
