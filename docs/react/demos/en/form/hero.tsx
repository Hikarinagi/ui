'use client'

import { useState } from 'react'
import * as v from 'valibot'
import { Button, Form, FormField, Input, Select, Switch, Text, Textarea } from '@hina-ui/react'

const schema = v.object({
  title: v.pipe(
    v.string('Enter a title'),
    v.nonEmpty('Enter a title'),
    v.maxLength(20, 'Keep the title within 20 characters'),
  ),
  category: v.pipe(v.string('Pick a category'), v.nonEmpty('Pick a category')),
  summary: v.pipe(
    v.string('Enter a summary'),
    v.maxLength(80, 'Keep the summary within 80 characters'),
  ),
  published: v.boolean('Choose whether it is public'),
})

const categories = [
  { label: 'Game', value: 'game' },
  { label: 'Novel', value: 'novel' },
  { label: 'Manga', value: 'manga' },
]

export default function Demo() {
  const [values, setValues] = useState({
    title: '',
    category: null as string | number | null | undefined,
    summary: '',
    published: true,
  })
  const [saved, setSaved] = useState('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 800))
    setSaved(JSON.stringify(data))
  }

  return (
    <Form values={values} rules={schema} className="w-80" onSubmit={save}>
      {({ submitting }) => (
        <>
          <FormField name="title" label="Title" required>
            <Input
              value={values.title}
              onValueChange={title => setValues({ ...values, title })}
              placeholder="Name of the work"
            />
          </FormField>
          <FormField name="category" label="Category" required>
            <Select
              value={values.category}
              onValueChange={category => setValues({ ...values, category })}
              options={categories}
            />
          </FormField>
          <FormField name="summary" label="Summary" description="Up to 80 characters">
            <Textarea
              value={values.summary}
              onValueChange={summary => setValues({ ...values, summary })}
            />
          </FormField>
          <FormField name="published">
            <Switch
              checked={values.published}
              onCheckedChange={published => setValues({ ...values, published })}
            >
              Public
            </Switch>
          </FormField>
          <Button type="submit" loading={submitting} className="self-start">
            Submit
          </Button>
          {saved && (
            <Text tone="muted" size="sm">
              Submitted: {saved}
            </Text>
          )}
        </>
      )}
    </Form>
  )
}
