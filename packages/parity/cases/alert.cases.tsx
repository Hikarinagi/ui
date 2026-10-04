import { h } from 'vue'
import VAlert from '@hina-ui/vue/components/alert/Alert.vue'
import VButton from '@hina-ui/vue/components/button/Button.vue'
import { Alert } from '@hina-ui/react/components/alert/Alert'
import { Button } from '@hina-ui/react/components/button/Button'
import { defineCases } from '../src/cases'

const tones = ['neutral', 'accent', 'info', 'success', 'warning', 'danger'] as const

export default defineCases('Alert', [
  {
    name: 'default tone renders status with icon',
    vue: () => h(VAlert, null, () => '已保存到草稿箱。'),
    react: () => <Alert>已保存到草稿箱。</Alert>,
  },
  ...tones.map(tone => ({
    name: `${tone} with default icon and title`,
    vue: () => h(VAlert, { tone, title: '标题' }, () => '正文。'),
    react: () => (
      <Alert tone={tone} title="标题">
        正文。
      </Alert>
    ),
  })),
  ...tones.map(tone => ({
    name: `${tone} without icon`,
    vue: () => h(VAlert, { tone, icon: false }, () => '正文。'),
    react: () => (
      <Alert tone={tone} icon={false}>
        正文。
      </Alert>
    ),
  })),
  {
    name: 'title, icon off and actions slot',
    vue: () =>
      h(
        VAlert,
        { title: '草稿已保存', icon: false },
        {
          default: () => '已保存到草稿箱。',
          actions: () => h('button', { type: 'button' }, '查看'),
        },
      ),
    react: () => (
      <Alert title="草稿已保存" icon={false} actions={<button type="button">查看</button>}>
        已保存到草稿箱。
      </Alert>
    ),
  },
  {
    name: 'closable renders the localized close button',
    vue: () => h(VAlert, { closable: true }, () => '已保存到草稿箱。'),
    react: () => <Alert closable>已保存到草稿箱。</Alert>,
  },
  {
    name: 'danger with title, closable and actions',
    vue: () =>
      h(
        VAlert,
        { tone: 'danger', title: '发布失败', closable: true },
        {
          default: () => '已保存到草稿箱。',
          actions: () => h('button', { type: 'button' }, '重试'),
        },
      ),
    react: () => (
      <Alert tone="danger" title="发布失败" closable actions={<button type="button">重试</button>}>
        已保存到草稿箱。
      </Alert>
    ),
  },
  {
    name: 'icon slot replaces the default icon',
    vue: () =>
      h(
        VAlert,
        { tone: 'accent' },
        { default: () => '正文', icon: () => h('svg', { 'data-probe': '' }) },
      ),
    react: () => (
      <Alert tone="accent" icon={<svg data-probe="" />}>
        正文
      </Alert>
    ),
  },
  {
    name: 'icon slot wins over icon false',
    vue: () =>
      h(
        VAlert,
        { icon: false },
        { default: () => '正文', icon: () => h('i', { 'data-probe': '' }) },
      ),
    react: () => <Alert icon={<i data-probe="" />}>正文</Alert>,
  },
  {
    name: 'closed alert renders nothing',
    vue: () => h('div', null, [h(VAlert, { open: false }, () => '正文')]),
    react: () => (
      <div>
        <Alert open={false}>正文</Alert>
      </div>
    ),
  },
  {
    name: 'defaultOpen false renders nothing',
    vue: () => h('div', null, [h(VAlert, { open: false, closable: true }, () => '正文')]),
    react: () => (
      <div>
        <Alert defaultOpen={false} closable>
          正文
        </Alert>
      </div>
    ),
  },
  {
    name: 'class goes to the box, attributes fall through to the shell',
    vue: () =>
      h(
        VAlert,
        { class: 'w-full max-w-xl', id: 'notice', 'data-test': 'x', style: { marginTop: '4px' } },
        () => '正文',
      ),
    react: () => (
      <Alert className="w-full max-w-xl" id="notice" data-test="x" style={{ marginTop: '4px' }}>
        正文
      </Alert>
    ),
  },
  {
    name: 'actions with library buttons and empty title',
    vue: () =>
      h(
        VAlert,
        { tone: 'info', title: '' },
        {
          default: () => '你的文章收到了 3 条新评论。',
          actions: () => [
            h(VButton, { size: 'sm', variant: 'soft', tone: 'neutral' }, () => '稍后'),
            h(VButton, { size: 'sm' }, () => '查看'),
          ],
        },
      ),
    react: () => (
      <Alert
        tone="info"
        title=""
        actions={
          <>
            <Button size="sm" variant="soft" tone="neutral">
              稍后
            </Button>
            <Button size="sm">查看</Button>
          </>
        }
      >
        你的文章收到了 3 条新评论。
      </Alert>
    ),
  },
])
