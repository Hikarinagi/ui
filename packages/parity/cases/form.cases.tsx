import { h } from 'vue'
import * as V from '@hina-ui/vue'
import * as R from '@hina-ui/react'
import { defineCases } from '../src/cases'

const values = { name: '', email: '' }

export default defineCases('Form', [
  {
    name: 'fields and submit button',
    vue: () =>
      h(V.Form, { values, class: 'w-80' }, () => [
        h(
          V.FormField,
          { name: 'name', label: '昵称', description: '2 到 12 个字', required: true },
          () => h(V.Input),
        ),
        h(V.Button, { type: 'submit', class: 'self-start' }, () => '保存'),
      ]),
    react: () => (
      <R.Form values={values} className="w-80">
        <R.FormField name="name" label="昵称" description="2 到 12 个字" required>
          <R.Input />
        </R.FormField>
        <R.Button type="submit" className="self-start">
          保存
        </R.Button>
      </R.Form>
    ),
  },
  {
    name: 'slot props',
    vue: () =>
      h(
        V.Form,
        { values },
        { default: (slot: Record<string, unknown>) => h('pre', JSON.stringify(slot)) },
      ),
    react: () => <R.Form values={values}>{slot => <pre>{JSON.stringify(slot)}</pre>}</R.Form>,
  },
  {
    name: 'disabled form disables fields',
    vue: () =>
      h(V.Form, { values, disabled: true }, () => [
        h(V.FormField, { name: 'name', label: '名称' }, () => h(V.Input)),
        h(V.FormField, { name: 'email', label: '邮箱' }, () => h(V.Textarea)),
      ]),
    react: () => (
      <R.Form values={values} disabled>
        <R.FormField name="name" label="名称">
          <R.Input />
        </R.FormField>
        <R.FormField name="email" label="邮箱">
          <R.Textarea />
        </R.FormField>
      </R.Form>
    ),
  },
  {
    name: 'layout inside a form',
    vue: () =>
      h(V.Form, { values, class: 'w-full max-w-lg', id: 'contact' }, () => [
        h(
          V.FormLayout,
          { legend: '联系人', description: '姓名与至少一种联系方式', columns: 2 },
          () => [
            h(V.FormField, { name: 'lastName', label: '姓', required: true }, () => h(V.Input)),
            h(V.FormField, { name: 'email', label: '邮箱', class: 'sm:col-span-2' }, () =>
              h(V.Input, { type: 'email' }),
            ),
          ],
        ),
      ]),
    react: () => (
      <R.Form values={values} className="w-full max-w-lg" id="contact">
        <R.FormLayout legend="联系人" description="姓名与至少一种联系方式" columns={2}>
          <R.FormField name="lastName" label="姓" required>
            <R.Input />
          </R.FormField>
          <R.FormField name="email" label="邮箱" className="sm:col-span-2">
            <R.Input type="email" />
          </R.FormField>
        </R.FormLayout>
      </R.Form>
    ),
  },
])
