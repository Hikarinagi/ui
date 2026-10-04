import { h } from 'vue'
import * as V from '@hina-ui/vue'
import * as R from '@hina-ui/react'
import { defineCases } from '../src/cases'

export default defineCases('Checkbox', [
  {
    name: 'bare',
    vue: () => h(V.Checkbox),
    react: () => <R.Checkbox />,
  },
  {
    name: 'label',
    vue: () => h(V.Checkbox, null, () => '订阅周报'),
    react: () => <R.Checkbox>订阅周报</R.Checkbox>,
  },
  {
    name: 'description, class and attrs on the box',
    vue: () =>
      h(
        V.Checkbox,
        { description: '每周一封', class: 'w-64', id: 'letter', 'data-x': '1' },
        () => '订阅周报',
      ),
    react: () => (
      <R.Checkbox description="每周一封" className="w-64" id="letter" data-x="1">
        订阅周报
      </R.Checkbox>
    ),
  },
  {
    name: 'aria-label only',
    vue: () => h(V.Checkbox, { 'aria-label': '全选' }),
    react: () => <R.Checkbox aria-label="全选" />,
  },
  {
    name: 'checked',
    vue: () => h(V.Checkbox, { modelValue: true }, () => '已读'),
    react: () => <R.Checkbox checked>已读</R.Checkbox>,
  },
  {
    name: 'indeterminate',
    vue: () => h(V.Checkbox, { modelValue: 'indeterminate' }, () => '部分'),
    react: () => <R.Checkbox checked="indeterminate">部分</R.Checkbox>,
  },
  ...(['sm', 'md', 'lg'] as const).map(size => ({
    name: `size ${size}`,
    vue: () => h(V.Checkbox, { size, description: 'd', modelValue: true }, () => size),
    react: () => (
      <R.Checkbox size={size} description="d" checked>
        {size}
      </R.Checkbox>
    ),
  })),
  {
    name: 'disabled',
    vue: () => h(V.Checkbox, { disabled: true }, () => '禁用'),
    react: () => <R.Checkbox disabled>禁用</R.Checkbox>,
  },
  {
    name: 'disabled checked',
    vue: () => h(V.Checkbox, { disabled: true, modelValue: true }, () => '禁用'),
    react: () => (
      <R.Checkbox disabled checked>
        禁用
      </R.Checkbox>
    ),
  },
  {
    name: 'invalid',
    vue: () => h(V.Checkbox, { invalid: true }, () => '无效'),
    react: () => <R.Checkbox invalid>无效</R.Checkbox>,
  },
  {
    name: 'control at the end, block',
    vue: () =>
      h(
        V.Checkbox,
        { controlPlacement: 'end', block: true, description: '同步阅读进度' },
        () => '同步',
      ),
    react: () => (
      <R.Checkbox controlPlacement="end" block description="同步阅读进度">
        同步
      </R.Checkbox>
    ),
  },
  {
    name: 'bare with control at the end',
    vue: () => h(V.Checkbox, { controlPlacement: 'end', 'aria-label': '同步' }),
    react: () => <R.Checkbox controlPlacement="end" aria-label="同步" />,
  },
  {
    name: 'name renders the hidden input',
    vue: () => h(V.Checkbox, { name: 'agree', modelValue: true }, () => '同意'),
    react: () => (
      <R.Checkbox name="agree" checked>
        同意
      </R.Checkbox>
    ),
  },
  {
    name: 'name, required and unchecked',
    vue: () => h(V.Checkbox, { name: 'agree', required: true }, () => '同意'),
    react: () => (
      <R.Checkbox name="agree" required>
        同意
      </R.Checkbox>
    ),
  },
  {
    name: 'aria-describedby is merged with the field',
    vue: () =>
      h(V.FormField, { label: '协议', description: '必须同意', error: '请勾选' }, () =>
        h(V.Checkbox, { 'aria-describedby': 'extra' }, () => '同意'),
      ),
    react: () => (
      <R.FormField label="协议" description="必须同意" error="请勾选">
        <R.Checkbox aria-describedby="extra">同意</R.Checkbox>
      </R.FormField>
    ),
  },
  {
    name: 'inside a disabled field',
    vue: () =>
      h(V.FormField, { label: '协议', disabled: true }, () => h(V.Checkbox, null, () => '同意')),
    react: () => (
      <R.FormField label="协议" disabled>
        <R.Checkbox>同意</R.Checkbox>
      </R.FormField>
    ),
  },
  {
    name: 'style goes to the box',
    vue: () => h(V.Checkbox, { style: { marginTop: '4px' } }, () => '样式'),
    react: () => <R.Checkbox style={{ marginTop: '4px' }}>样式</R.Checkbox>,
  },
])
