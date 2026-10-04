import { h } from 'vue'
import * as V from '@hina-ui/vue'
import * as R from '@hina-ui/react'
import { defineCases } from '../src/cases'

const orientations = ['vertical', 'horizontal', 'responsive'] as const
const placements = ['label', 'control'] as const

export default defineCases('FormField', [
  {
    name: 'label points at the input',
    vue: () => h(V.FormField, { label: '昵称', class: 'w-80' }, () => h(V.Input)),
    react: () => (
      <R.FormField label="昵称" className="w-80">
        <R.Input />
      </R.FormField>
    ),
  },
  {
    name: 'hero: description and required',
    vue: () =>
      h(V.FormField, { label: '昵称', description: '公开显示在个人页', required: true }, () =>
        h(V.Input, { placeholder: '星见书音' }),
      ),
    react: () => (
      <R.FormField label="昵称" description="公开显示在个人页" required>
        <R.Input placeholder="星见书音" />
      </R.FormField>
    ),
  },
  {
    name: 'error marks the control invalid',
    vue: () =>
      h(V.FormField, { label: '名称', error: '不能为空' }, () => h(V.Input, { type: 'email' })),
    react: () => (
      <R.FormField label="名称" error="不能为空">
        <R.Input type="email" />
      </R.FormField>
    ),
  },
  {
    name: 'disabled reaches the control',
    vue: () => h(V.FormField, { label: '名称', disabled: true }, () => h(V.Input)),
    react: () => (
      <R.FormField label="名称" disabled>
        <R.Input />
      </R.FormField>
    ),
  },
  {
    name: 'control id and describedby from the control',
    vue: () =>
      h(V.FormField, { label: '名称', description: '说明', error: '错误' }, () =>
        h(V.Input, { id: 'custom', 'aria-describedby': 'external-help' }),
      ),
    react: () => (
      <R.FormField label="名称" description="说明" error="错误">
        <R.Input id="custom" aria-describedby="external-help" />
      </R.FormField>
    ),
  },
  ...orientations.flatMap(orientation =>
    placements.map(descriptionPlacement => ({
      name: `${orientation} with description at the ${descriptionPlacement}`,
      vue: () =>
        h(
          V.FormField,
          {
            label: 'Display name',
            description: 'Shown on your profile',
            error: 'Please enter a name',
            orientation,
            descriptionPlacement,
            labelWidth: 120,
          },
          () => h(V.Input),
        ),
      react: () => (
        <R.FormField
          label="Display name"
          description="Shown on your profile"
          error="Please enter a name"
          orientation={orientation}
          descriptionPlacement={descriptionPlacement}
          labelWidth={120}
        >
          <R.Input />
        </R.FormField>
      ),
    })),
  ),
  {
    name: 'label width as a string',
    vue: () =>
      h(
        V.FormField,
        { label: '显示名称', orientation: 'horizontal', labelWidth: '8rem', class: 'w-full' },
        () => h(V.Input),
      ),
    react: () => (
      <R.FormField label="显示名称" orientation="horizontal" labelWidth="8rem" className="w-full">
        <R.Input />
      </R.FormField>
    ),
  },
  {
    name: 'no heading keeps the control full width',
    vue: () =>
      h(V.FormField, { orientation: 'horizontal', error: 'Save failed' }, () => h(V.Input)),
    react: () => (
      <R.FormField orientation="horizontal" error="Save failed">
        <R.Input />
      </R.FormField>
    ),
  },
  {
    name: 'label and description slots',
    vue: () =>
      h(
        V.FormField,
        { orientation: 'horizontal', descriptionPlacement: 'label', disabled: true },
        {
          label: () => 'Name',
          description: () => h('em', 'Visible to everyone'),
          default: () => h(V.Input),
        },
      ),
    react: () => (
      <R.FormField
        orientation="horizontal"
        descriptionPlacement="label"
        disabled
        label="Name"
        description={<em>Visible to everyone</em>}
      >
        <R.Input />
      </R.FormField>
    ),
  },
  {
    name: 'textarea with description slot',
    vue: () =>
      h(
        V.FormField,
        { label: '简介' },
        { default: () => h(V.Textarea), description: () => '不超过 80 个字，支持换行。' },
      ),
    react: () => (
      <R.FormField label="简介" description="不超过 80 个字，支持换行。">
        <R.Textarea />
      </R.FormField>
    ),
  },
  {
    name: 'password, search and file upload controls',
    vue: () =>
      h('div', null, [
        h(V.FormField, { label: '密码', error: '太短' }, () => h(V.PasswordInput)),
        h(V.FormField, { label: '搜索', description: '关键词' }, () => h(V.SearchInput)),
        h(V.FormField, { label: '附件', description: '最多 3 个' }, () => h(V.FileUpload)),
        h(V.FormField, { label: '按钮', error: '必填', disabled: true }, () =>
          h(V.FileUpload, { variant: 'button' }),
        ),
      ]),
    react: () => (
      <div>
        <R.FormField label="密码" error="太短">
          <R.PasswordInput />
        </R.FormField>
        <R.FormField label="搜索" description="关键词">
          <R.SearchInput />
        </R.FormField>
        <R.FormField label="附件" description="最多 3 个">
          <R.FileUpload />
        </R.FormField>
        <R.FormField label="按钮" error="必填" disabled>
          <R.FileUpload variant="button" />
        </R.FormField>
      </div>
    ),
  },
  {
    name: 'number input and editable',
    vue: () =>
      h('div', null, [
        h(V.FormField, { label: '数量', error: '超出' }, () => h(V.NumberInput)),
        h(V.FormField, { label: '标题', description: '公开', name: 'title' }, () =>
          h(V.Editable, { modelValue: 'Project title' }),
        ),
      ]),
    react: () => (
      <div>
        <R.FormField label="数量" error="超出">
          <R.NumberInput />
        </R.FormField>
        <R.FormField label="标题" description="公开" name="title">
          <R.Editable value="Project title" />
        </R.FormField>
      </div>
    ),
  },
  {
    name: 'input group inside a field',
    vue: () =>
      h(V.FormField, { name: 'site', label: '个人主页', required: true }, () =>
        h(V.InputGroup, null, () => [
          h(V.InputGroupAddon, null, () => 'https://'),
          h(V.Input, { placeholder: 'example.com' }),
        ]),
      ),
    react: () => (
      <R.FormField name="site" label="个人主页" required>
        <R.InputGroup>
          <R.InputGroupAddon>https://</R.InputGroupAddon>
          <R.Input placeholder="example.com" />
        </R.InputGroup>
      </R.FormField>
    ),
  },
  {
    name: 'attrs and class on the root',
    vue: () =>
      h(V.FormField, { label: '名称', class: 'sm:col-span-2', 'data-probe': 'field' }, () =>
        h(V.Input),
      ),
    react: () => (
      <R.FormField label="名称" className="sm:col-span-2" data-probe="field">
        <R.Input />
      </R.FormField>
    ),
  },
])
