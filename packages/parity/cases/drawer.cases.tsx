import { h } from 'vue'
import VDrawer from '@hina-ui/vue/components/drawer/Drawer.vue'
import VButton from '@hina-ui/vue/components/button/Button.vue'
import { Drawer } from '@hina-ui/react/components/drawer/Drawer'
import { Button } from '@hina-ui/react/components/button/Button'
import { defineCases } from '../src/cases'

const trigger = () => h(VButton, { variant: 'outline', tone: 'neutral' }, () => '打开抽屉')

export default defineCases('Drawer', [
  {
    name: 'closed trigger',
    vue: () =>
      h(VDrawer, { title: '筛选条件', description: '按标签与年份过滤。' }, { default: trigger }),
    react: () => (
      <Drawer title="筛选条件" description="按标签与年份过滤。">
        <Button variant="outline" tone="neutral">
          打开抽屉
        </Button>
      </Drawer>
    ),
  },
  {
    name: 'closed trigger with side, size and slots',
    vue: () =>
      h(
        VDrawer,
        { title: '导航', side: 'start', size: 'sm', locked: true },
        { default: trigger, content: () => h('p', '正文'), footer: () => h(VButton, () => '应用') },
      ),
    react: () => (
      <Drawer
        title="导航"
        side="start"
        size="sm"
        locked
        renderContent={() => <p>正文</p>}
        renderFooter={() => <Button>应用</Button>}
      >
        <Button variant="outline" tone="neutral">
          打开抽屉
        </Button>
      </Drawer>
    ),
  },
  {
    name: 'controlled open trigger state before the portal mounts',
    vue: () => h(VDrawer, { title: '筛选条件', open: true }, { default: trigger }),
    react: () => (
      <Drawer title="筛选条件" open>
        <Button variant="outline" tone="neutral">
          打开抽屉
        </Button>
      </Drawer>
    ),
  },
])
