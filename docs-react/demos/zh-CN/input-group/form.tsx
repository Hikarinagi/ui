'use client'

import { useState } from 'react'
import * as v from 'valibot'
import { Button, Form, FormField, Input, InputGroup, InputGroupAddon, Text } from '@hina-ui/react'

const schema = v.object({
  site: v.pipe(
    v.string('请输入网址'),
    v.trim(),
    v.nonEmpty('请输入网址'),
    v.regex(/^[\w-]+(\.[\w-]+)+(\/.*)?$/, '网址格式不正确，不需要填写协议'),
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
          <FormField name="site" label="个人主页" required>
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
