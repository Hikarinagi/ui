import { h } from 'vue'
import VButtonGroup from '@hina-ui/vue/components/button-group/ButtonGroup.vue'
import VButton from '@hina-ui/vue/components/button/Button.vue'
import { ButtonGroup } from '@hina-ui/react/components/button-group/ButtonGroup'
import { Button } from '@hina-ui/react/components/button/Button'
import { defineCases } from '../src/cases'

const labels = ['左', '中', '右']
const vueButtons = () =>
  labels.map(label => h(VButton, { variant: 'outline', tone: 'neutral' }, () => label))
const reactButtons = () =>
  labels.map(label => (
    <Button key={label} variant="outline" tone="neutral">
      {label}
    </Button>
  ))

export default defineCases('ButtonGroup', [
  {
    name: 'default',
    vue: () => h(VButtonGroup, null, vueButtons),
    react: () => <ButtonGroup>{reactButtons()}</ButtonGroup>,
  },
  {
    name: 'labelled',
    vue: () => h(VButtonGroup, { label: '对齐方式' }, vueButtons),
    react: () => <ButtonGroup label="对齐方式">{reactButtons()}</ButtonGroup>,
  },
  {
    name: 'vertical with divider',
    vue: () => h(VButtonGroup, { orientation: 'vertical', divider: true }, vueButtons),
    react: () => (
      <ButtonGroup orientation="vertical" divider>
        {reactButtons()}
      </ButtonGroup>
    ),
  },
  {
    name: 'explicit horizontal with divider',
    vue: () => h(VButtonGroup, { orientation: 'horizontal', divider: true }, vueButtons),
    react: () => (
      <ButtonGroup orientation="horizontal" divider>
        {reactButtons()}
      </ButtonGroup>
    ),
  },
  {
    name: 'block',
    vue: () => h(VButtonGroup, { label: '投票', block: true }, vueButtons),
    react: () => (
      <ButtonGroup label="投票" block>
        {reactButtons()}
      </ButtonGroup>
    ),
  },
  {
    name: 'class merge and fallthrough attributes',
    vue: () =>
      h(
        VButtonGroup,
        {
          label: '排序',
          class: '[&>*:first-child]:rounded-s-full [&>*:last-child]:rounded-e-full',
          id: 'sort',
        },
        vueButtons,
      ),
    react: () => (
      <ButtonGroup
        label="排序"
        className="[&>*:first-child]:rounded-s-full [&>*:last-child]:rounded-e-full"
        id="sort"
      >
        {reactButtons()}
      </ButtonGroup>
    ),
  },
  {
    name: 'mixed disabled children',
    vue: () =>
      h(VButtonGroup, { label: '单个不可用' }, () => [
        h(VButton, { variant: 'outline', tone: 'neutral', disabled: true }, () => '上一页'),
        h(VButton, { variant: 'outline', tone: 'neutral' }, () => '刷新'),
      ]),
    react: () => (
      <ButtonGroup label="单个不可用">
        <Button variant="outline" tone="neutral" disabled>
          上一页
        </Button>
        <Button variant="outline" tone="neutral">
          刷新
        </Button>
      </ButtonGroup>
    ),
  },
])
