'use client'

import { useState } from 'react'
import * as v from 'valibot'
import { Button, Form, FormField, NumberInput, Text } from '@hina-ui/react'

const schema = v.object({
  price: v.pipe(
    v.number('请输入价格'),
    v.minValue(1, '价格至少 1 元'),
    v.maxValue(9999, '价格不超过 9999 元'),
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
          <FormField name="price" label="价格" description="1 到 9999 元" required>
            <NumberInput
              value={values.price}
              onValueChange={price => setValues({ ...values, price })}
              min={0}
              step={1}
            />
          </FormField>
          <Button type="submit" loading={submitting} className="self-start">
            上架
          </Button>
          {saved && (
            <Text tone="muted" size="sm">
              已上架：{saved}
            </Text>
          )}
        </>
      )}
    </Form>
  )
}
