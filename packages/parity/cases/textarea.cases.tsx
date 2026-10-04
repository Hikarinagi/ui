import { h } from 'vue'
import * as V from '@hina-ui/vue'
import * as R from '@hina-ui/react'
import { defineCases } from '../src/cases'

export default defineCases('Textarea', [
  {
    name: 'default',
    vue: () => h(V.Textarea),
    react: () => <R.Textarea />,
  },
  {
    name: 'attrs go to the native textarea',
    vue: () =>
      h(V.Textarea, { placeholder: '写点什么', maxlength: 200, 'aria-label': '评论', id: 't' }),
    react: () => <R.Textarea placeholder="写点什么" maxLength={200} aria-label="评论" id="t" />,
  },
  {
    name: 'value and rows',
    vue: () => h(V.Textarea, { modelValue: '一\n二', rows: 5 }),
    react: () => <R.Textarea value={'一\n二'} rows={5} />,
  },
  ...(['primary', 'secondary', 'bare'] as const).map(variant => ({
    name: `variant ${variant}`,
    vue: () => h(V.Textarea, { variant, placeholder: variant }),
    react: () => <R.Textarea variant={variant} placeholder={variant} />,
  })),
  ...(['sm', 'md', 'lg'] as const).map(size => ({
    name: `size ${size} with one row`,
    vue: () => h(V.Textarea, { size, rows: 1, placeholder: size }),
    react: () => <R.Textarea size={size} rows={1} placeholder={size} />,
  })),
  {
    name: 'autosize',
    vue: () => h(V.Textarea, { autosize: true, modelValue: '简介' }),
    react: () => <R.Textarea autosize value="简介" />,
  },
  {
    name: 'autosize with bounds',
    vue: () => h(V.Textarea, { autosize: { minRows: 2, maxRows: 5 } }),
    react: () => <R.Textarea autosize={{ minRows: 2, maxRows: 5 }} />,
  },
  {
    name: 'autosize keeps rows',
    vue: () => h(V.Textarea, { autosize: true, rows: 4 }),
    react: () => <R.Textarea autosize rows={4} />,
  },
  {
    name: 'resize none',
    vue: () => h(V.Textarea, { resize: 'none' }),
    react: () => <R.Textarea resize="none" />,
  },
  {
    name: 'invalid',
    vue: () => h(V.Textarea, { invalid: true, modelValue: '简介不能少于二十个字。' }),
    react: () => <R.Textarea invalid value="简介不能少于二十个字。" />,
  },
  {
    name: 'disabled',
    vue: () => h(V.Textarea, { disabled: true, modelValue: '审核期间不能修改简介。' }),
    react: () => <R.Textarea disabled value="审核期间不能修改简介。" />,
  },
  {
    name: 'class',
    vue: () => h(V.Textarea, { class: 'w-full max-w-md' }),
    react: () => <R.Textarea className="w-full max-w-md" />,
  },
])
