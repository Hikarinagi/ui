'use client'

import { useState } from 'react'
import * as v from 'valibot'
import { Button, Form, FormField, Text, TreeSelect, type TreeSelectValue } from '@hina-ui/react'
import { regions } from './data'

const schema = v.object({
  region: v.string('Pick a region'),
})

export default function Demo() {
  const [values, setValues] = useState({ region: null as TreeSelectValue })
  const [saved, setSaved] = useState('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    setSaved(JSON.stringify(data))
  }

  return (
    <Form values={values} rules={schema} className="w-80" onSubmit={save}>
      {({ submitting }) => (
        <>
          <FormField name="region" label="Region" required>
            <TreeSelect
              value={values.region}
              onValueChange={region => setValues({ ...values, region })}
              items={regions}
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
