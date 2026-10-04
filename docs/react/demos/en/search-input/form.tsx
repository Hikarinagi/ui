'use client'

import { useState } from 'react'
import * as v from 'valibot'
import { Button, Form, FormField, SearchInput, Text } from '@hina-ui/react'

const schema = v.object({
  keyword: v.pipe(
    v.string('Enter a keyword'),
    v.trim(),
    v.nonEmpty('Enter a keyword'),
    v.minLength(2, 'At least 2 characters'),
  ),
})

export default function Demo() {
  const [values, setValues] = useState({ keyword: '' })
  const [result, setResult] = useState('')

  async function search(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    setResult((data as { keyword: string }).keyword)
  }

  return (
    <Form values={values} rules={schema} className="w-80" onSubmit={search}>
      {({ submitting }) => (
        <>
          <FormField name="keyword" label="Search works">
            <SearchInput
              value={values.keyword}
              onValueChange={keyword => setValues({ ...values, keyword })}
              placeholder="Title or alias"
            />
          </FormField>
          <Button type="submit" loading={submitting} className="self-start">
            Search
          </Button>
          {result && (
            <Text tone="muted" size="sm">
              Searching for &quot;{result}&quot;.
            </Text>
          )}
        </>
      )}
    </Form>
  )
}
