'use client'

import { useState } from 'react'
import * as v from 'valibot'
import { Button, Form, FormField, FormLayout, Input, Switch, Text, Textarea } from '@hina-ui/react'

const schema = v.object({
  name: v.pipe(v.string('Enter a nickname'), v.nonEmpty('Enter a nickname')),
  bio: v.pipe(v.string(), v.maxLength(80, 'Keep the bio within 80 characters')),
  notifyEmail: v.boolean(),
  notifyPush: v.boolean(),
})

export default function Demo() {
  const [values, setValues] = useState({ name: '', bio: '', notifyEmail: true, notifyPush: false })
  const [saved, setSaved] = useState('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    setSaved(JSON.stringify(data))
  }

  return (
    <Form values={values} rules={schema} className="w-80" onSubmit={save}>
      {({ submitting }) => (
        <>
          <FormLayout legend="Profile" description="Shown on your profile page">
            <FormField name="name" label="Nickname" required>
              <Input value={values.name} onValueChange={name => setValues({ ...values, name })} />
            </FormField>
            <FormField name="bio" label="Bio">
              <Textarea value={values.bio} onValueChange={bio => setValues({ ...values, bio })} />
            </FormField>
          </FormLayout>
          <FormLayout
            legend="Notifications"
            description="Let you know about replies and new followers"
          >
            <FormField name="notifyEmail">
              <Switch
                checked={values.notifyEmail}
                onCheckedChange={notifyEmail => setValues({ ...values, notifyEmail })}
              >
                Email
              </Switch>
            </FormField>
            <FormField name="notifyPush">
              <Switch
                checked={values.notifyPush}
                onCheckedChange={notifyPush => setValues({ ...values, notifyPush })}
              >
                Push
              </Switch>
            </FormField>
          </FormLayout>
          <Button type="submit" loading={submitting} className="self-start">
            Save
          </Button>
          {saved && (
            <Text tone="muted" size="sm">
              Saved: {saved}
            </Text>
          )}
        </>
      )}
    </Form>
  )
}
