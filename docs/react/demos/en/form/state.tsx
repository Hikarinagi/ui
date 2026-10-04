'use client'

import { useState } from 'react'
import * as v from 'valibot'
import { Button, Form, FormField, Input, Stack, Switch } from '@hina-ui/react'

const schema = v.object({
  name: v.pipe(v.string('Enter a name'), v.nonEmpty('Enter a name')),
})

function save() {
  return new Promise(resolve => setTimeout(resolve, 1500))
}

export default function Demo() {
  const [values, setValues] = useState({ name: 'Hoshimi Shion' })
  const [disabled, setDisabled] = useState(false)

  return (
    <Stack gap="md" align="stretch" className="w-80">
      <Switch checked={disabled} onCheckedChange={setDisabled}>
        Disable the form
      </Switch>
      <Form values={values} rules={schema} disabled={disabled} onSubmit={save}>
        {({ submitting }) => (
          <>
            <FormField name="name" label="Name">
              <Input value={values.name} onValueChange={name => setValues({ ...values, name })} />
            </FormField>
            <Button type="submit" loading={submitting} disabled={disabled} className="self-start">
              Save
            </Button>
          </>
        )}
      </Form>
    </Stack>
  )
}
