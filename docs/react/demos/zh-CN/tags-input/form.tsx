'use client'

import { useState } from 'react'
import * as v from 'valibot'
import { Button, Form, FormField, TagsInput, Text } from '@hina-ui/react'

const schema = v.object({
  aliases: v.pipe(
    v.array(v.pipe(v.string(), v.maxLength(20, '别名不超过 20 个字'))),
    v.minLength(1, '至少填写一个别名'),
    v.maxLength(5, '最多五个别名'),
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
          <FormField name="aliases" label="别名" description="回车添加，最多五个" required>
            <TagsInput
              value={values.aliases}
              onValueChange={aliases => setValues({ ...values, aliases })}
            />
          </FormField>
          <Button type="submit" loading={submitting} className="self-start">
            保存
          </Button>
          {saved && (
            <Text tone="muted" size="sm">
              已保存：{saved}
            </Text>
          )}
        </>
      )}
    </Form>
  )
}
