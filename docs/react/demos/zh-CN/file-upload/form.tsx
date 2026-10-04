'use client'

import { useState } from 'react'
import * as v from 'valibot'
import { Button, FileUpload, Form, FormField, Text } from '@hina-ui/react'

const schema = v.object({
  cover: v.pipe(
    v.instance(File, '请选择封面图片'),
    v.check(file => file.size <= 2 * 1024 * 1024, '图片不能超过 2MB'),
  ),
})

export default function Demo() {
  const [values, setValues] = useState({ cover: null as File | null })
  const [saved, setSaved] = useState('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    setSaved((data as { cover: File }).cover.name)
  }

  return (
    <Form values={values} rules={schema} className="w-80" onSubmit={save}>
      {({ submitting }) => (
        <>
          <FormField name="cover" label="封面" description="图片，不超过 2MB" required>
            <FileUpload
              value={values.cover}
              onValueChange={cover => setValues({ ...values, cover: cover as File | null })}
              accept="image/*"
            />
          </FormField>
          <Button type="submit" loading={submitting} className="self-start">
            上传
          </Button>
          {saved && (
            <Text tone="muted" size="sm">
              已上传：{saved}
            </Text>
          )}
        </>
      )}
    </Form>
  )
}
