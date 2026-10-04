import { h } from 'vue'
import * as V from '@hina-ui/vue'
import * as R from '@hina-ui/react'
import { defineCases } from '../src/cases'

export default defineCases('Editable', [
  {
    name: 'preview button',
    vue: () => h(V.Editable, { modelValue: '文档名称', 'aria-label': '文档名称' }),
    react: () => <R.Editable value="文档名称" aria-label="文档名称" />,
  },
  {
    name: 'empty with default placeholder',
    vue: () => h(V.Editable),
    react: () => <R.Editable />,
  },
  {
    name: 'empty with placeholder',
    vue: () => h(V.Editable, { placeholder: '添加备注…' }),
    react: () => <R.Editable placeholder="添加备注…" />,
  },
  ...(['sm', 'md', 'lg'] as const).map(size => ({
    name: `size ${size}`,
    vue: () => h(V.Editable, { size, modelValue: '文本', 'aria-label': size }),
    react: () => <R.Editable size={size} value="文本" aria-label={size} />,
  })),
  {
    name: 'readonly',
    vue: () => h(V.Editable, { modelValue: '只读项目名称', readonly: true }),
    react: () => <R.Editable value="只读项目名称" readonly />,
  },
  {
    name: 'disabled',
    vue: () => h(V.Editable, { modelValue: '暂时无法修改', disabled: true }),
    react: () => <R.Editable value="暂时无法修改" disabled />,
  },
  {
    name: 'invalid',
    vue: () => h(V.Editable, { modelValue: 'x', invalid: true }),
    react: () => <R.Editable value="x" invalid />,
  },
  {
    name: 'double click activation',
    vue: () => h(V.Editable, { modelValue: '双击', activationMode: 'dblclick' }),
    react: () => <R.Editable value="双击" activationMode="dblclick" />,
  },
  {
    name: 'manual activation shows the edit action',
    vue: () =>
      h(V.Editable, { modelValue: '手动', activationMode: 'manual', submitMode: 'manual' }),
    react: () => <R.Editable value="手动" activationMode="manual" submitMode="manual" />,
  },
  {
    name: 'manual and disabled',
    vue: () => h(V.Editable, { modelValue: '手动', activationMode: 'manual', disabled: true }),
    react: () => <R.Editable value="手动" activationMode="manual" disabled />,
  },
  {
    name: 'editing a single line',
    vue: () =>
      h(V.Editable, {
        modelValue: '<Project>',
        editing: true,
        name: 'title',
        maxlength: 60,
        required: true,
        'aria-label': 'Title',
      }),
    react: () => (
      <R.Editable
        value="<Project>"
        editing
        name="title"
        maxlength={60}
        required
        aria-label="Title"
      />
    ),
  },
  {
    name: 'editing multiline',
    vue: () =>
      h(V.Editable, {
        modelValue: '第一行\n第二行',
        editing: true,
        multiline: true,
        rows: 3,
        size: 'lg',
      }),
    react: () => <R.Editable value={'第一行\n第二行'} editing multiline rows={3} size="lg" />,
  },
  {
    name: 'multiline preview',
    vue: () => h(V.Editable, { modelValue: '第一行\n第二行', multiline: true, name: 'bio' }),
    react: () => <R.Editable value={'第一行\n第二行'} multiline name="bio" />,
  },
  {
    name: 'editing without controls',
    vue: () => h(V.Editable, { modelValue: 'x', editing: true, controls: false }),
    react: () => <R.Editable value="x" editing controls={false} />,
  },
  {
    name: 'editing while disabled shows the preview',
    vue: () => h(V.Editable, { modelValue: 'x', editing: true, disabled: true }),
    react: () => <R.Editable value="x" editing disabled />,
  },
  {
    name: 'custom preview and actions',
    vue: () =>
      h(
        V.Editable,
        { modelValue: '1.2.0', activationMode: 'manual', submitMode: 'manual' },
        {
          preview: ({ value }: { value: string }) => h(V.Tag, { tone: 'info' }, () => `v${value}`),
          actions: ({ editing, saving }: { editing: boolean; saving: boolean }) =>
            h(V.Button, { size: 'sm', loading: saving }, () => (editing ? '保存版本' : '修改版本')),
        },
      ),
    react: () => (
      <R.Editable
        value="1.2.0"
        activationMode="manual"
        submitMode="manual"
        renderPreview={({ value }) => <R.Tag tone="info">v{value}</R.Tag>}
        renderActions={({ editing, saving }) => (
          <R.Button size="sm" loading={saving}>
            {editing ? '保存版本' : '修改版本'}
          </R.Button>
        )}
      />
    ),
  },
  {
    name: 'inside a form field',
    vue: () =>
      h(V.FormField, { label: '项目名称', description: '公开' }, () =>
        h(V.Editable, { modelValue: 'Hina', maxlength: 60 }),
      ),
    react: () => (
      <R.FormField label="项目名称" description="公开">
        <R.Editable value="Hina" maxlength={60} />
      </R.FormField>
    ),
  },
  {
    name: 'editing inside a form field',
    vue: () =>
      h(V.FormField, { label: '简介', error: '太长' }, () =>
        h(V.Editable, { modelValue: '很长', editing: true, multiline: true }),
      ),
    react: () => (
      <R.FormField label="简介" error="太长">
        <R.Editable value="很长" editing multiline />
      </R.FormField>
    ),
  },
  {
    name: 'class',
    vue: () => h(V.Editable, { modelValue: 'x', class: 'max-w-sm' }),
    react: () => <R.Editable value="x" className="max-w-sm" />,
  },
])
