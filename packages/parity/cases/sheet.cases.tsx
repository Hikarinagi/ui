import { h } from 'vue'
import VSheet from '@hina-ui/vue/components/sheet/Sheet.vue'
import VButton from '@hina-ui/vue/components/button/Button.vue'
import { Sheet } from '@hina-ui/react/components/sheet/Sheet'
import { Button } from '@hina-ui/react/components/button/Button'
import { defineCases } from '../src/cases'

const trigger = () => h(VButton, { variant: 'outline', tone: 'neutral' }, () => '打开')

export default defineCases('Sheet', [
  {
    name: 'closed trigger',
    vue: () => h(VSheet, { title: '分享到', description: '选择一个去处。' }, { default: trigger }),
    react: () => (
      <Sheet title="分享到" description="选择一个去处。">
        <Button variant="outline" tone="neutral">
          打开
        </Button>
      </Sheet>
    ),
  },
  {
    name: 'closed trigger with handle, header and lock props',
    vue: () =>
      h(
        VSheet,
        { title: '分享到', handle: false, header: false, locked: true, class: 'sm:max-w-lg' },
        { default: trigger, content: () => h('p', '正文') },
      ),
    react: () => (
      <Sheet
        title="分享到"
        handle={false}
        header={false}
        locked
        className="sm:max-w-lg"
        renderContent={() => <p>正文</p>}
      >
        <Button variant="outline" tone="neutral">
          打开
        </Button>
      </Sheet>
    ),
  },
  {
    name: 'controlled open trigger state before the portal mounts',
    vue: () => h(VSheet, { title: '分享到', open: true }, { default: trigger }),
    react: () => (
      <Sheet title="分享到" open>
        <Button variant="outline" tone="neutral">
          打开
        </Button>
      </Sheet>
    ),
  },
])
