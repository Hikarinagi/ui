'use client'

import { useState } from 'react'
import * as v from 'valibot'
import { Button, CheckboxGroup, Form, FormField, Text } from '@hina-ui/react'

const options = [
  { label: '游戏', value: 'game' },
  { label: '小说', value: 'novel' },
  { label: '漫画', value: 'manga' },
  { label: '动画', value: 'anime' },
]

const schema = v.object({
  interests: v.pipe(
    v.array(v.string('请选择兴趣')),
    v.minLength(1, '至少选择一项'),
    v.maxLength(2, '最多选择两项'),
  ),
})

export default function Demo() {
  const [values, setValues] = useState({ interests: [] as Array<string | number> })
  const [saved, setSaved] = useState('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    setSaved(JSON.stringify(data))
  }

  return (
    <Form values={values} rules={schema} className="w-80" onSubmit={save}>
      {({ submitting }) => (
        <>
          <FormField name="interests" label="兴趣" description="选一到两项" required>
            <CheckboxGroup
              value={values.interests}
              onValueChange={interests => setValues({ ...values, interests })}
              options={options}
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
