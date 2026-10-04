import { h } from 'vue'
import VMark from '@hina-ui/vue/components/mark/Mark.vue'
import { Mark } from '@hina-ui/react/components/mark/Mark'
import { defineCases } from '../src/cases'

export default defineCases('Mark', [
  {
    name: 'default',
    vue: () => h(VMark, null, () => '香辛料'),
    react: () => <Mark>香辛料</Mark>,
  },
  {
    name: 'class and attributes',
    vue: () => h(VMark, { class: 'font-medium', 'data-hit': '1' }, () => '命中词'),
    react: () => (
      <Mark className="font-medium" data-hit="1">
        命中词
      </Mark>
    ),
  },
])
