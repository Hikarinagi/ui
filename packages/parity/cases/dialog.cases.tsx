import { h } from 'vue'
import VDialog from '@hina-ui/vue/components/dialog/Dialog.vue'
import VButton from '@hina-ui/vue/components/button/Button.vue'
import { Dialog } from '@hina-ui/react/components/dialog/Dialog'
import { Button } from '@hina-ui/react/components/button/Button'
import { defineCases } from '../src/cases'

const trigger = () => h(VButton, { variant: 'outline', tone: 'neutral' }, () => '打开')

export default defineCases('Dialog', [
  {
    name: 'closed trigger',
    vue: () =>
      h(VDialog, { title: '删除条目', description: '此操作不可撤销。' }, { default: trigger }),
    react: () => (
      <Dialog title="删除条目" description="此操作不可撤销。">
        <Button variant="outline" tone="neutral">
          打开
        </Button>
      </Dialog>
    ),
  },
  {
    name: 'closed trigger ignores panel props and slots on the server',
    vue: () =>
      h(
        VDialog,
        {
          title: '设置',
          size: '2xl',
          placement: 'top',
          header: false,
          closable: false,
          locked: true,
          class: 'max-w-[40rem]',
        },
        {
          default: trigger,
          icon: () => h('svg'),
          content: () => h('p', '正文'),
          footer: () => h(VButton, () => '确定'),
        },
      ),
    react: () => (
      <Dialog
        title="设置"
        size="2xl"
        placement="top"
        header={false}
        closable={false}
        locked
        className="max-w-[40rem]"
        icon={<svg />}
        renderContent={() => <p>正文</p>}
        renderFooter={() => <Button>确定</Button>}
      >
        <Button variant="outline" tone="neutral">
          打开
        </Button>
      </Dialog>
    ),
  },
  {
    name: 'controlled open trigger state before the portal mounts',
    vue: () => h(VDialog, { title: '删除条目', open: true }, { default: trigger }),
    react: () => (
      <Dialog title="删除条目" open>
        <Button variant="outline" tone="neutral">
          打开
        </Button>
      </Dialog>
    ),
  },
  {
    name: 'native element trigger',
    vue: () => h(VDialog, { title: '标题' }, { default: () => h('a', { href: '#' }, '链接') }),
    react: () => (
      <Dialog title="标题">
        <a href="#">链接</a>
      </Dialog>
    ),
  },
])
