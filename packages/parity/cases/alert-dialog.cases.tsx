import { h } from 'vue'
import VAlertDialog from '@hina-ui/vue/components/alert-dialog/AlertDialog.vue'
import VButton from '@hina-ui/vue/components/button/Button.vue'
import { AlertDialog } from '@hina-ui/react/components/alert-dialog/AlertDialog'
import { Button } from '@hina-ui/react/components/button/Button'
import { defineCases } from '../src/cases'

const trigger = () => h(VButton, { variant: 'outline', tone: 'danger' }, () => '删除')

export default defineCases('AlertDialog', [
  {
    name: 'closed trigger',
    vue: () =>
      h(VAlertDialog, { title: '删除条目', description: '此操作不可撤销。' }, { default: trigger }),
    react: () => (
      <AlertDialog title="删除条目" description="此操作不可撤销。">
        <Button variant="outline" tone="danger">
          删除
        </Button>
      </AlertDialog>
    ),
  },
  {
    name: 'closed trigger with every panel prop',
    vue: () =>
      h(
        VAlertDialog,
        {
          title: '确认操作？',
          confirmText: '确认',
          cancelText: '再想想',
          confirmDelay: 3,
          tone: 'danger',
          size: 'md',
          placement: 'bottom',
          class: 'max-w-md',
        },
        { default: trigger, content: () => h('p', '附加内容') },
      ),
    react: () => (
      <AlertDialog
        title="确认操作？"
        confirmText="确认"
        cancelText="再想想"
        confirmDelay={3}
        tone="danger"
        size="md"
        placement="bottom"
        className="max-w-md"
        content={<p>附加内容</p>}
      >
        <Button variant="outline" tone="danger">
          删除
        </Button>
      </AlertDialog>
    ),
  },
  {
    name: 'controlled open trigger state before the portal mounts',
    vue: () => h(VAlertDialog, { title: '删除条目', open: true }, { default: trigger }),
    react: () => (
      <AlertDialog title="删除条目" open>
        <Button variant="outline" tone="danger">
          删除
        </Button>
      </AlertDialog>
    ),
  },
])
