import { h } from 'vue'
import VDivider from '@hina-ui/vue/components/divider/Divider.vue'
import { Divider } from '@hina-ui/react/components/divider/Divider'
import { defineCases } from '../src/cases'

export default defineCases('Divider', [
  {
    name: 'default horizontal separator',
    vue: () => h(VDivider),
    react: () => <Divider />,
  },
  {
    name: 'vertical',
    vue: () => h(VDivider, { orientation: 'vertical' }),
    react: () => <Divider orientation="vertical" />,
  },
  {
    name: 'decorative',
    vue: () => h(VDivider, { decorative: true }),
    react: () => <Divider decorative />,
  },
  {
    name: 'vertical decorative short line',
    vue: () => h(VDivider, { orientation: 'vertical', decorative: true, class: 'h-6 self-center' }),
    react: () => <Divider orientation="vertical" decorative className="h-6 self-center" />,
  },
  {
    name: 'label',
    vue: () => h(VDivider, null, () => '第三卷'),
    react: () => <Divider>第三卷</Divider>,
  },
  {
    name: 'label with class and attributes',
    vue: () => h(VDivider, { class: 'my-4', id: 'or' }, () => '或者'),
    react: () => (
      <Divider className="my-4" id="or">
        或者
      </Divider>
    ),
  },
  {
    name: 'vertical ignores the label slot',
    vue: () => h(VDivider, { orientation: 'vertical' }, () => '忽略'),
    react: () => <Divider orientation="vertical">忽略</Divider>,
  },
  {
    name: 'attributes reach the separator',
    vue: () => h(VDivider, { 'aria-label': 'Chapter break', class: 'my-2' }),
    react: () => <Divider aria-label="Chapter break" className="my-2" />,
  },
])
