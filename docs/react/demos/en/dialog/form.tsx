'use client'

import { useState } from 'react'
import * as v from 'valibot'
import { Button, Dialog, Form, FormField, Input } from '@hina-ui/react'

const schema = v.object({
  name: v.pipe(v.string('Enter a name'), v.nonEmpty('Enter a name')),
  email: v.pipe(
    v.string('Enter an email'),
    v.nonEmpty('Enter an email'),
    v.email('That is not a valid email'),
  ),
})

export default function Demo() {
  const [open, setOpen] = useState(false)
  const [values, setValues] = useState({ name: 'Hoshimi Shion', email: 'shion@example.com' })

  async function save() {
    await new Promise(resolve => setTimeout(resolve, 1500))
    setOpen(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      title="Edit profile"
      description="The dialog is locked while saving and closes when it is done."
      renderContent={() => (
        <Form id="profile-form" values={values} rules={schema} onSubmit={save}>
          <FormField name="name" label="Name">
            <Input value={values.name} onValueChange={name => setValues({ ...values, name })} />
          </FormField>
          <FormField name="email" label="Email">
            <Input
              value={values.email}
              onValueChange={email => setValues({ ...values, email })}
              type="email"
            />
          </FormField>
        </Form>
      )}
      renderFooter={({ close, submitting }) => (
        <>
          <Button variant="soft" tone="neutral" disabled={submitting} onClick={close}>
            Cancel
          </Button>
          <Button type="submit" form="profile-form" loading={submitting}>
            Save
          </Button>
        </>
      )}
    >
      <Button variant="outline" tone="neutral">
        Edit profile
      </Button>
    </Dialog>
  )
}
