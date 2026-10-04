import { h } from 'vue'
import VChip from '@hina-ui/vue/components/chip/Chip.vue'
import { Chip } from '@hina-ui/react/components/chip/Chip'
import { defineCases } from '../src/cases'

const variants = ['soft', 'outline'] as const
const tones = ['neutral', 'accent'] as const
const sizes = ['sm', 'md'] as const

export default defineCases('Chip', [
  {
    name: 'default renders a plain span',
    vue: () => h(VChip, null, () => '科幻'),
    react: () => <Chip>科幻</Chip>,
  },
  ...variants.flatMap(variant =>
    tones.flatMap(tone =>
      sizes.map(size => ({
        name: `${variant} ${tone} ${size} selectable`,
        vue: () => h(VChip, { variant, tone, size, selectable: true }, () => '科幻'),
        react: () => (
          <Chip variant={variant} tone={tone} size={size} selectable>
            科幻
          </Chip>
        ),
      })),
    ),
  ),
  ...sizes.map(size => ({
    name: `${size} selected`,
    vue: () => h(VChip, { size, selectable: true, selected: true }, () => '已选中'),
    react: () => (
      <Chip size={size} selectable selected>
        已选中
      </Chip>
    ),
  })),
  ...sizes.map(size => ({
    name: `${size} removable`,
    vue: () => h(VChip, { size, removable: true }, () => '科幻'),
    react: () => (
      <Chip size={size} removable>
        科幻
      </Chip>
    ),
  })),
  {
    name: 'defaultSelected uncontrolled',
    vue: () => h(VChip, { selectable: true, selected: true }, () => '已完结'),
    react: () => (
      <Chip selectable defaultSelected>
        已完结
      </Chip>
    ),
  },
  {
    name: 'selected without selectable has no check',
    vue: () => h(VChip, { selected: true }, () => '科幻'),
    react: () => <Chip selected>科幻</Chip>,
  },
  {
    name: 'selectable disabled',
    vue: () => h(VChip, { selectable: true, disabled: true }, () => '未选中'),
    react: () => (
      <Chip selectable disabled>
        未选中
      </Chip>
    ),
  },
  {
    name: 'selectable selected disabled',
    vue: () => h(VChip, { selectable: true, selected: true, disabled: true }, () => '已选中'),
    react: () => (
      <Chip selectable selected disabled>
        已选中
      </Chip>
    ),
  },
  {
    name: 'removable disabled',
    vue: () => h(VChip, { removable: true, disabled: true }, () => '不可移除'),
    react: () => (
      <Chip removable disabled>
        不可移除
      </Chip>
    ),
  },
  {
    name: 'plain disabled',
    vue: () => h(VChip, { disabled: true }, () => '科幻'),
    react: () => <Chip disabled>科幻</Chip>,
  },
  {
    name: 'selectable and removable ignores removable',
    vue: () => h(VChip, { selectable: true, removable: true }, () => '科幻'),
    react: () => (
      <Chip selectable removable>
        科幻
      </Chip>
    ),
  },
  {
    name: 'icon slot on a plain chip',
    vue: () => h(VChip, null, { default: () => '科幻', icon: () => h('i', { 'data-probe': '' }) }),
    react: () => <Chip icon={<i data-probe="" />}>科幻</Chip>,
  },
  {
    name: 'icon slot on a selectable chip',
    vue: () =>
      h(
        VChip,
        { selectable: true },
        { default: () => '热门', icon: () => h('svg', { 'data-probe': '' }) },
      ),
    react: () => (
      <Chip selectable icon={<svg data-probe="" />}>
        热门
      </Chip>
    ),
  },
  {
    name: 'icon slot on a selected chip',
    vue: () =>
      h(
        VChip,
        { selectable: true, selected: true },
        { default: () => '热门', icon: () => h('svg', { 'data-probe': '' }) },
      ),
    react: () => (
      <Chip selectable selected icon={<svg data-probe="" />}>
        热门
      </Chip>
    ),
  },
  {
    name: 'icon slot on a removable chip',
    vue: () =>
      h(
        VChip,
        { removable: true, size: 'sm' },
        { default: () => '收藏', icon: () => h('svg', { 'data-probe': '' }) },
      ),
    react: () => (
      <Chip removable size="sm" icon={<svg data-probe="" />}>
        收藏
      </Chip>
    ),
  },
  {
    name: 'as a link',
    vue: () => h(VChip, { as: 'a', href: '#', variant: 'outline' }, () => '恋爱'),
    react: () => (
      <Chip as="a" href="#" variant="outline">
        恋爱
      </Chip>
    ),
  },
  {
    name: 'disabled link',
    vue: () => h(VChip, { as: 'a', href: '#', disabled: true }, () => '恋爱'),
    react: () => (
      <Chip as="a" href="#" disabled>
        恋爱
      </Chip>
    ),
  },
  {
    name: 'button without ripple',
    vue: () => h(VChip, { as: 'button', ripple: false }, () => '按钮'),
    react: () => (
      <Chip as="button" ripple={false}>
        按钮
      </Chip>
    ),
  },
  {
    name: 'asChild without decorations',
    vue: () => h(VChip, { asChild: true, ripple: false }, () => h('a', { href: '#x' }, '链接')),
    react: () => (
      <Chip asChild ripple={false}>
        <a href="#x">链接</a>
      </Chip>
    ),
  },
  {
    name: 'class and attributes fall through to the root',
    vue: () =>
      h(
        VChip,
        { class: 'ms-2', id: 'chip', 'data-state': 'custom', 'aria-label': '标签' },
        () => '科幻',
      ),
    react: () => (
      <Chip className="ms-2" id="chip" data-state="custom" aria-label="标签">
        科幻
      </Chip>
    ),
  },
])
