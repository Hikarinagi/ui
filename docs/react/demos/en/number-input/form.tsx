'use client'

import { useState } from 'react'
import * as v from 'valibot'
import { Button, Form, FormField, NumberInput, Text } from '@hina-ui/react'

const schema = v.object({
  price: v.pipe(
    v.number('Enter a price'),
    v.minValue(1, 'The price must be at least 1'),
    v.maxValue(9999, 'The price must be at most 9999'),
  ),
})

export default function Demo() {
  const [values, setValues] = useState({ price: null as number | null | undefined })
  const [saved, setSaved] = useState('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    setSaved(JSON.stringify(data))
  }

  return (
    <Form values={values} rules={schema} className="w-80" onSubmit={save}>
      {({ submitting }) => (
        <>
          <FormField name="price" label="Price" description="1 to 9999" required>
            <NumberInput
              value={values.price}
              onValueChange={price => setValues({ ...values, price })}
              min={0}
              step={1}
            />
          </FormField>
          <Button type="submit" loading={submitting} className="self-start">
            List
          </Button>
          {saved && (
            <Text tone="muted" size="sm">
              Listed: {saved}
            </Text>
          )}
        </>
      )}
    </Form>
  )
}
