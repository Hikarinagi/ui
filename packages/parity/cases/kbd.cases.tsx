import { h } from 'vue'
import VKbd from '@hina-ui/vue/components/kbd/Kbd.vue'
import { Kbd } from '@hina-ui/react/components/kbd/Kbd'
import { defineCases } from '../src/cases'

export default defineCases('Kbd', [
  {
    name: 'default',
    vue: () => h(VKbd, null, () => 'Esc'),
    react: () => <Kbd>Esc</Kbd>,
  },
  {
    name: 'class and attributes',
    vue: () => h(VKbd, { class: 'text-xs', 'aria-label': 'Control' }, () => 'Ctrl'),
    react: () => (
      <Kbd className="text-xs" aria-label="Control">
        Ctrl
      </Kbd>
    ),
  },
])
