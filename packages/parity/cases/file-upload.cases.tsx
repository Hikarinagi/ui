import { h } from 'vue'
import * as V from '@hina-ui/vue'
import * as R from '@hina-ui/react'
import { defineCases } from '../src/cases'

const file = (name: string, size: number, type = 'application/pdf') =>
  new File([new Uint8Array(size)], name, { type, lastModified: 1 })

const pdf = file('contract.pdf', 1536)
const notes = file('notes.txt', 512, 'text/plain')
const photo = file('photo.png', 3 * 1024 * 1024, 'image/png')

export default defineCases('FileUpload', [
  {
    name: 'drop area',
    vue: () => h(V.FileUpload, { 'aria-label': '上传封面' }),
    react: () => <R.FileUpload aria-label="上传封面" />,
  },
  {
    name: 'accept, multiple and name reach the hidden input',
    vue: () =>
      h(V.FileUpload, {
        accept: 'image/*',
        multiple: true,
        name: 'cover',
        'aria-label': '上传截图',
        class: 'w-96',
      }),
    react: () => (
      <R.FileUpload accept="image/*" multiple name="cover" aria-label="上传截图" className="w-96" />
    ),
  },
  {
    name: 'button variant',
    vue: () => h(V.FileUpload, { variant: 'button', accept: '.pdf', 'aria-label': '上传合同' }),
    react: () => <R.FileUpload variant="button" accept=".pdf" aria-label="上传合同" />,
  },
  {
    name: 'button variant loading with label',
    vue: () => h(V.FileUpload, { variant: 'button', loading: true }, () => '上传中'),
    react: () => (
      <R.FileUpload variant="button" loading>
        上传中
      </R.FileUpload>
    ),
  },
  {
    name: 'invalid',
    vue: () => h(V.FileUpload, { invalid: true, 'aria-label': '校验未通过' }),
    react: () => <R.FileUpload invalid aria-label="校验未通过" />,
  },
  {
    name: 'disabled',
    vue: () => h(V.FileUpload, { disabled: true, 'aria-label': '已禁用' }),
    react: () => <R.FileUpload disabled aria-label="已禁用" />,
  },
  {
    name: 'loading',
    vue: () => h(V.FileUpload, { loading: true, 'aria-label': '上传中' }, () => '上传中'),
    react: () => (
      <R.FileUpload loading aria-label="上传中">
        上传中
      </R.FileUpload>
    ),
  },
  {
    name: 'icon slot and label',
    vue: () =>
      h(
        V.FileUpload,
        { 'aria-label': '上传图片', class: 'aspect-square w-40' },
        { icon: () => h('svg', { 'data-probe': 'icon' }), default: () => '添加图片' },
      ),
    react: () => (
      <R.FileUpload
        aria-label="上传图片"
        className="aspect-square w-40"
        icon={<svg data-probe="icon" />}
      >
        添加图片
      </R.FileUpload>
    ),
  },
  {
    name: 'single file listed with size and remove button',
    vue: () => h(V.FileUpload, { modelValue: pdf }),
    react: () => <R.FileUpload value={pdf} />,
  },
  {
    name: 'multiple files',
    vue: () => h(V.FileUpload, { modelValue: [pdf, notes], multiple: true, disabled: true }),
    react: () => <R.FileUpload value={[pdf, notes]} multiple disabled />,
  },
  {
    name: 'list hidden',
    vue: () => h(V.FileUpload, { modelValue: [pdf], multiple: true, list: false }),
    react: () => <R.FileUpload value={[pdf]} multiple list={false} />,
  },
  {
    name: 'image without preview',
    vue: () => h(V.FileUpload, { modelValue: photo, preview: false }),
    react: () => <R.FileUpload value={photo} preview={false} />,
  },
])
