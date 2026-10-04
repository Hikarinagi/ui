import { h } from 'vue'
import * as V from '@hina-ui/vue'
import * as R from '@hina-ui/react'
import { defineCases } from '../src/cases'

const tags = ['galgame', '轻小说']

export default defineCases('TagsInput', [
  {
    name: 'empty',
    vue: () => h(V.TagsInput, { 'aria-label': '标签' }),
    react: () => <R.TagsInput aria-label="标签" />,
  },
  {
    name: 'tags with placeholder and class',
    vue: () =>
      h(V.TagsInput, {
        modelValue: tags,
        placeholder: '添加标签',
        class: 'mt-2',
        'aria-label': '标签',
      }),
    react: () => (
      <R.TagsInput value={tags} placeholder="添加标签" className="mt-2" aria-label="标签" />
    ),
  },
  ...(['primary', 'secondary'] as const).map(variant => ({
    name: `variant ${variant}`,
    vue: () => h(V.TagsInput, { modelValue: tags, variant }),
    react: () => <R.TagsInput value={tags} variant={variant} />,
  })),
  ...(['sm', 'md', 'lg'] as const).map(size => ({
    name: `size ${size}`,
    vue: () => h(V.TagsInput, { modelValue: tags, size, clearable: true }),
    react: () => <R.TagsInput value={tags} size={size} clearable />,
  })),
  {
    name: 'invalid',
    vue: () => h(V.TagsInput, { modelValue: tags, invalid: true }),
    react: () => <R.TagsInput value={tags} invalid />,
  },
  {
    name: 'disabled with clear',
    vue: () => h(V.TagsInput, { modelValue: tags, disabled: true, clearable: true }),
    react: () => <R.TagsInput value={tags} disabled clearable />,
  },
  {
    name: 'clearable without tags',
    vue: () => h(V.TagsInput, { clearable: true }),
    react: () => <R.TagsInput clearable />,
  },
  {
    name: 'native form values',
    vue: () => h(V.TagsInput, { modelValue: tags, name: 'tags' }),
    react: () => <R.TagsInput value={tags} name="tags" />,
  },
  {
    name: 'max, delimiter and paste options',
    vue: () =>
      h(V.TagsInput, {
        modelValue: tags,
        max: 3,
        delimiter: /[,;]/,
        addOnPaste: false,
        addOnBlur: true,
        duplicate: true,
      }),
    react: () => (
      <R.TagsInput value={tags} max={3} delimiter={/[,;]/} addOnPaste={false} addOnBlur duplicate />
    ),
  },
  {
    name: 'forwarded input attributes',
    vue: () =>
      h(V.TagsInput, {
        id: 'tags',
        'aria-describedby': 'hint',
        maxlength: 12,
        'data-testid': 'tags',
      }),
    react: () => (
      <R.TagsInput id="tags" aria-describedby="hint" maxLength={12} data-testid="tags" />
    ),
  },
  {
    name: 'inside a form field',
    vue: () =>
      h(V.FormField, { label: '标签', description: '回车添加', error: '至少一个' }, () =>
        h(V.TagsInput, { modelValue: tags }),
      ),
    react: () => (
      <R.FormField label="标签" description="回车添加" error="至少一个">
        <R.TagsInput value={tags} />
      </R.FormField>
    ),
  },
])
