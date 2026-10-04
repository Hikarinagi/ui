'use client'

import { useState } from 'react'
import * as v from 'valibot'
import { Button, Form, FormField, Input, Stack, Switch } from '@hina-ui/react'

const schema = v.object({
  name: v.pipe(v.string('请输入名称'), v.nonEmpty('请输入名称')),
})

function save() {
  return new Promise(resolve => setTimeout(resolve, 1500))
}

export default function Demo() {
  const [values, setValues] = useState({ name: '星见书音' })
  const [disabled, setDisabled] = useState(false)

  return (
    <Stack gap="md" align="stretch" className="w-80">
      <Switch checked={disabled} onCheckedChange={setDisabled}>
        禁用表单
      </Switch>
      <Form values={values} rules={schema} disabled={disabled} onSubmit={save}>
        {({ submitting }) => (
          <>
            <FormField name="name" label="名称">
              <Input value={values.name} onValueChange={name => setValues({ ...values, name })} />
            </FormField>
            <Button type="submit" loading={submitting} disabled={disabled} className="self-start">
              保存
            </Button>
          </>
        )}
      </Form>
    </Stack>
  )
}
