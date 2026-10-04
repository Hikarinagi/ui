import { h } from 'vue'
import VAlertDialog from '@hina-ui/vue/components/alert-dialog/AlertDialog.vue'
import VButton from '@hina-ui/vue/components/button/Button.vue'
import { AlertDialog } from '@hina-ui/react/components/alert-dialog/AlertDialog'
import { Button } from '@hina-ui/react/components/button/Button'
import { defineLiveCases } from '../src/live'
import {
  clickScrim,
  clickText,
  clickTrigger,
  pressEscape,
  settleClosed,
  settleOpen,
  sequence,
  unstamp,
  wait,
} from './dialog.live'

const opened = settleOpen('[role="alertdialog"]')
const closed = settleClosed()
const openAndSettle = sequence(clickTrigger, opened, unstamp)

const base = { title: '删除条目', description: '此操作不可撤销。' }
const vueTrigger = () => h(VButton, { variant: 'outline', tone: 'danger' }, () => '删除')
const reactTrigger = (
  <Button variant="outline" tone="danger">
    删除
  </Button>
)

const pending = () => new Promise<void>(() => {})

export default defineLiveCases('AlertDialog', [
  {
    name: 'opens with focus on cancel',
    vue: () => h(VAlertDialog, base, { default: vueTrigger }),
    react: () => <AlertDialog {...base}>{reactTrigger}</AlertDialog>,
    interact: clickTrigger,
    settle: opened,
  },
  {
    name: 'danger tone with custom texts',
    vue: () =>
      h(
        VAlertDialog,
        { ...base, tone: 'danger', confirmText: '注销', cancelText: '再想想' },
        { default: vueTrigger },
      ),
    react: () => (
      <AlertDialog {...base} tone="danger" confirmText="注销" cancelText="再想想">
        {reactTrigger}
      </AlertDialog>
    ),
    interact: clickTrigger,
    settle: opened,
  },
  {
    name: 'confirm delay shows the countdown',
    vue: () =>
      h(VAlertDialog, { ...base, confirmDelay: 30, confirmText: '确认' }, { default: vueTrigger }),
    react: () => (
      <AlertDialog {...base} confirmDelay={30} confirmText="确认">
        {reactTrigger}
      </AlertDialog>
    ),
    interact: clickTrigger,
    settle: opened,
  },
  ...(
    [
      { size: 'md' as const },
      { placement: 'center' as const },
      { placement: 'bottom' as const },
      { size: 'md' as const, placement: 'center' as const, class: 'max-w-lg' },
    ] satisfies Array<Record<string, string>>
  ).map(props => ({
    name: `layout ${JSON.stringify(props)}`,
    vue: () => h(VAlertDialog, { ...base, ...props }, { default: vueTrigger }),
    react: () => {
      const { class: className, ...rest } = props as typeof props & { class?: string }
      return (
        <AlertDialog {...base} {...rest} className={className}>
          {reactTrigger}
        </AlertDialog>
      )
    },
    interact: clickTrigger,
    settle: opened,
  })),
  {
    name: 'content slot',
    vue: () => h(VAlertDialog, base, { default: vueTrigger, content: () => h('p', '附加内容') }),
    react: () => (
      <AlertDialog {...base} content={<p>附加内容</p>}>
        {reactTrigger}
      </AlertDialog>
    ),
    interact: clickTrigger,
    settle: opened,
  },
  {
    name: 'no description keeps the primitive description reference',
    vue: () => h(VAlertDialog, { title: '确认操作？' }, { default: vueTrigger }),
    react: () => <AlertDialog title="确认操作？">{reactTrigger}</AlertDialog>,
    interact: clickTrigger,
    settle: opened,
  },
  {
    name: 'controlled open without a trigger',
    vue: () => h(VAlertDialog, { ...base, open: true }),
    react: () => <AlertDialog {...base} open />,
    settle: opened,
  },
  {
    name: 'scrim click keeps it open',
    vue: () => h(VAlertDialog, base, { default: vueTrigger }),
    react: () => <AlertDialog {...base}>{reactTrigger}</AlertDialog>,
    interact: sequence(openAndSettle, clickScrim, () => wait(300)),
    settle: opened,
  },
  {
    name: 'Escape closes and returns focus to the trigger',
    vue: () => h(VAlertDialog, base, { default: vueTrigger }),
    react: () => <AlertDialog {...base}>{reactTrigger}</AlertDialog>,
    interact: sequence(openAndSettle, pressEscape),
    settle: closed,
  },
  {
    name: 'cancel closes and returns focus to the trigger',
    vue: () => h(VAlertDialog, base, { default: vueTrigger }),
    react: () => <AlertDialog {...base}>{reactTrigger}</AlertDialog>,
    interact: sequence(openAndSettle, clickText('[role="alertdialog"]', '取消')),
    settle: closed,
  },
  {
    name: 'confirm closes',
    vue: () => h(VAlertDialog, { ...base, onConfirm: () => {} }, { default: vueTrigger }),
    react: () => (
      <AlertDialog {...base} onConfirm={() => {}}>
        {reactTrigger}
      </AlertDialog>
    ),
    interact: sequence(openAndSettle, clickText('[role="alertdialog"]', '确定')),
    settle: closed,
  },
  {
    name: 'pending confirm is busy and ignores Escape',
    vue: () => h(VAlertDialog, { ...base, onConfirm: pending }, { default: vueTrigger }),
    react: () => (
      <AlertDialog {...base} onConfirm={pending}>
        {reactTrigger}
      </AlertDialog>
    ),
    interact: sequence(openAndSettle, clickText('[role="alertdialog"]', '确定'), pressEscape, () =>
      wait(300),
    ),
    settle: opened,
  },
])
