import { h } from 'vue'
import * as V from '@hina-ui/vue'
import * as R from '@hina-ui/react'
import { defineCases } from '../src/cases'

function vField(label: string, props: Record<string, unknown> = {}) {
  return h(V.FormField, { label, ...props }, () => h(V.Input))
}

export default defineCases('FormLayout', [
  {
    name: 'legend and description',
    vue: () =>
      h(V.FormLayout, { legend: '账号', description: '登录时使用', class: 'w-80' }, () => [
        vField('用户名'),
        vField('邮箱'),
      ]),
    react: () => (
      <R.FormLayout legend="账号" description="登录时使用" className="w-80">
        <R.FormField label="用户名">
          <R.Input />
        </R.FormField>
        <R.FormField label="邮箱">
          <R.Input />
        </R.FormField>
      </R.FormLayout>
    ),
  },
  {
    name: 'no heading',
    vue: () => h(V.FormLayout, null, () => vField('email')),
    react: () => (
      <R.FormLayout>
        <R.FormField label="email">
          <R.Input />
        </R.FormField>
      </R.FormLayout>
    ),
  },
  ...([1, 2, 3, 4] as const).map(columns => ({
    name: `columns ${columns}`,
    vue: () =>
      h(V.FormLayout, { legend: '收货地址', columns }, () => [
        vField('省'),
        vField('详细地址', { class: 'sm:col-span-3' }),
      ]),
    react: () => (
      <R.FormLayout legend="收货地址" columns={columns}>
        <R.FormField label="省">
          <R.Input />
        </R.FormField>
        <R.FormField label="详细地址" className="sm:col-span-3">
          <R.Input />
        </R.FormField>
      </R.FormLayout>
    ),
  })),
  {
    name: 'disabled fieldset',
    vue: () => h(V.FormLayout, { legend: '账号', disabled: true }, () => vField('用户名')),
    react: () => (
      <R.FormLayout legend="账号" disabled>
        <R.FormField label="用户名">
          <R.Input />
        </R.FormField>
      </R.FormLayout>
    ),
  },
  {
    name: 'shared columns with per-field overrides',
    vue: () =>
      h(
        V.FormLayout,
        {
          legend: '个人资料设置',
          orientation: 'responsive',
          labelWidth: '9rem',
          descriptionPlacement: 'label',
        },
        () => [
          vField('显示名称', { description: '显示在你的公开个人资料中。' }),
          vField('邮箱地址', { description: '通知', descriptionPlacement: 'control' }),
          vField('Notes', { labelWidth: 200 }),
          vField('Stacked', { orientation: 'vertical' }),
        ],
      ),
    react: () => (
      <R.FormLayout
        legend="个人资料设置"
        orientation="responsive"
        labelWidth="9rem"
        descriptionPlacement="label"
      >
        <R.FormField label="显示名称" description="显示在你的公开个人资料中。">
          <R.Input />
        </R.FormField>
        <R.FormField label="邮箱地址" description="通知" descriptionPlacement="control">
          <R.Input />
        </R.FormField>
        <R.FormField label="Notes" labelWidth={200}>
          <R.Input />
        </R.FormField>
        <R.FormField label="Stacked" orientation="vertical">
          <R.Input />
        </R.FormField>
      </R.FormLayout>
    ),
  },
  {
    name: 'nested layouts',
    vue: () =>
      h(V.FormLayout, { orientation: 'horizontal', labelWidth: 120 }, () => [
        vField('Outer'),
        h(V.FormLayout, { labelWidth: 180, disabled: true }, () => vField('Inner')),
      ]),
    react: () => (
      <R.FormLayout orientation="horizontal" labelWidth={120}>
        <R.FormField label="Outer">
          <R.Input />
        </R.FormField>
        <R.FormLayout labelWidth={180} disabled>
          <R.FormField label="Inner">
            <R.Input />
          </R.FormField>
        </R.FormLayout>
      </R.FormLayout>
    ),
  },
  {
    name: 'legend and description slots',
    vue: () =>
      h(
        V.FormLayout,
        { 'data-probe': 'layout' },
        {
          legend: () => h('strong', '联系人'),
          description: () => h('em', '至少一种联系方式'),
          default: () => vField('电话'),
        },
      ),
    react: () => (
      <R.FormLayout
        data-probe="layout"
        legend={<strong>联系人</strong>}
        description={<em>至少一种联系方式</em>}
      >
        <R.FormField label="电话">
          <R.Input />
        </R.FormField>
      </R.FormLayout>
    ),
  },
])
