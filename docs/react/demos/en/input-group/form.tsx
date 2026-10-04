'use client'

import { useState } from 'react'
import * as v from 'valibot'
import { Button, Form, FormField, Input, InputGroup, InputGroupAddon, Text } from '@hina-ui/react'

const schema = v.object({
  site: v.pipe(
    v.string('Enter a website'),
    v.trim(),
    v.nonEmpty('Enter a website'),
    v.regex(/^[\w-]+(\.[\w-]+)+(\/.*)?$/, 'Not a valid address; leave out the protocol'),
  ),
})

export default function Demo() {
  const [values, setValues] = useState({ site: '' })
  const [saved, setSaved] = useState('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    setSaved(`https://${(data as { site: string }).site}`)
  }

  return (
    <Form values={values} rules={schema} className="w-80" onSubmit={save}>
      {({ submitting }) => (
        <>
          <FormField name="site" label="Website" required>
            <InputGroup>
              <InputGroupAddon>https://</InputGroupAddon>
              <Input
                value={values.site}
                onValueChange={site => setValues({ ...values, site })}
                placeholder="example.com"
              />
            </InputGroup>
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
