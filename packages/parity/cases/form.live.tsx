import { defineComponent, h, reactive } from 'vue'
import { userEvent } from 'vitest/browser'
import { vi } from 'vitest'
import { useState } from 'react'
import VForm from '@hina-ui/vue/components/form/Form.vue'
import VFormField from '@hina-ui/vue/components/form-field/FormField.vue'
import VInput from '@hina-ui/vue/components/input/Input.vue'
import VButton from '@hina-ui/vue/components/button/Button.vue'
import { Form as RForm } from '@hina-ui/react/components/form/Form'
import { FormField as RFormField } from '@hina-ui/react/components/form-field/FormField'
import { Input as RInput } from '@hina-ui/react/components/input/Input'
import { Button as RButton } from '@hina-ui/react/components/button/Button'
import type { FormErrors, FormValidateOn, FormValues } from '@hina-ui/vue'
import { defineLiveCases, frames } from '../src/live'

async function idle() {
  await vi.waitFor(
    () => {
      const running = document
        .getAnimations()
        .filter(a => a.playState === 'running' && !(a.timeline && 'source' in a.timeline))
      if (running.length) throw new Error('busy')
    },
    { timeout: 3000 },
  )
  await new Promise(resolve => setTimeout(resolve, 400))
  await frames(4)
}

function rules(values: FormValues) {
  const errors: FormErrors = {}
  if (!values.name) errors.name = '请输入名称'
  if (values.email && !String(values.email).includes('@')) errors.email = '邮箱格式不正确'
  return errors
}

function vueForm(validateOn: FormValidateOn) {
  return () =>
    h(
      defineComponent({
        setup() {
          const values = reactive({ name: '', email: '' })
          return () =>
            h(
              VForm,
              { values, rules, validateOn },
              {
                default: (slot: { submitted: boolean }) => [
                  h(VFormField, { name: 'name', label: '名称', required: true }, () =>
                    h(VInput, {
                      modelValue: values.name,
                      'onUpdate:modelValue': (next: string | undefined) =>
                        (values.name = next ?? ''),
                    }),
                  ),
                  h(VFormField, { name: 'email', label: '邮箱', description: '用于通知' }, () =>
                    h(VInput, {
                      modelValue: values.email,
                      'onUpdate:modelValue': (next: string | undefined) =>
                        (values.email = next ?? ''),
                    }),
                  ),
                  h('p', { 'data-submitted': String(slot.submitted) }),
                  h(VButton, { type: 'submit' }, () => '保存'),
                ],
              },
            )
        },
      }),
    )
}

function ReactForm({ validateOn }: { validateOn: FormValidateOn }) {
  const [values, setValues] = useState({ name: '', email: '' })
  return (
    <RForm values={values} rules={rules} validateOn={validateOn}>
      {slot => (
        <>
          <RFormField name="name" label="名称" required>
            <RInput value={values.name} onValueChange={name => setValues(v => ({ ...v, name }))} />
          </RFormField>
          <RFormField name="email" label="邮箱" description="用于通知">
            <RInput
              value={values.email}
              onValueChange={email => setValues(v => ({ ...v, email }))}
            />
          </RFormField>
          <p data-submitted={String(slot.submitted)} />
          <RButton type="submit">保存</RButton>
        </>
      )}
    </RForm>
  )
}

export default defineLiveCases('Form', [
  {
    name: 'submitting an empty form shows messages and focuses the first invalid field',
    vue: vueForm('submit'),
    react: () => <ReactForm validateOn="submit" />,
    interact: async container => {
      await userEvent.click(container.querySelector('button[type="submit"]')!)
      await vi.waitFor(() => {
        if (!container.querySelector('p[aria-live]')) throw new Error('no message')
      })
    },
    settle: idle,
  },
  {
    name: 'validateOn change reports while typing',
    vue: vueForm('change'),
    react: () => <ReactForm validateOn="change" />,
    interact: async container => {
      await userEvent.click(container.querySelectorAll('input')[1]!)
      await userEvent.keyboard('shion')
      await vi.waitFor(() => {
        if (!container.querySelector('p[aria-live]')) throw new Error('no message')
      })
    },
    settle: idle,
  },
  {
    name: 'fixing the value after submit clears the message',
    vue: vueForm('submit'),
    react: () => <ReactForm validateOn="submit" />,
    interact: async container => {
      await userEvent.click(container.querySelector('button[type="submit"]')!)
      await vi.waitFor(() => {
        if (!container.querySelector('p[aria-live]')) throw new Error('no message')
      })
      await userEvent.click(container.querySelector('input')!)
      await userEvent.keyboard('书音')
      await vi.waitFor(() => {
        if (container.querySelector('p[aria-live]')) throw new Error('message remains')
      })
    },
    settle: idle,
  },
])
