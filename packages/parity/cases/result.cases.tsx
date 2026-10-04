import { h } from 'vue'
import VResult from '@hina-ui/vue/components/result/Result.vue'
import VButton from '@hina-ui/vue/components/button/Button.vue'
import VText from '@hina-ui/vue/components/text/Text.vue'
import VCode from '@hina-ui/vue/components/code/Code.vue'
import VGrid from '@hina-ui/vue/components/grid/Grid.vue'
import VStack from '@hina-ui/vue/components/stack/Stack.vue'
import { Result } from '@hina-ui/react/components/result/Result'
import { Button } from '@hina-ui/react/components/button/Button'
import { Text } from '@hina-ui/react/components/text/Text'
import { Code } from '@hina-ui/react/components/code/Code'
import { Grid } from '@hina-ui/react/components/grid/Grid'
import { Stack } from '@hina-ui/react/components/stack/Stack'
import { defineCases } from '../src/cases'

const statuses = [
  { status: 'success', title: '已保存', description: '改动已经生效。' },
  { status: 'error', title: '保存失败', description: '网络中断，请稍后重试。' },
  { status: 'warning', title: '部分未保存', description: '有两处改动与他人冲突。' },
  { status: 'info', title: '等待审核', description: '审核通过后会通知你。' },
] as const

export default defineCases('Result', [
  {
    name: 'basic defaults to info',
    vue: () =>
      h(VResult, {
        title: '正在审核',
        description: '通常在一天之内完成，结果会以通知告知。',
        class: 'w-96',
      }),
    react: () => (
      <Result
        title="正在审核"
        description="通常在一天之内完成，结果会以通知告知。"
        className="w-96"
      />
    ),
  },
  {
    name: 'hero with actions',
    vue: () =>
      h(
        VResult,
        {
          status: 'success',
          title: '书评已发布',
          description: '其他读者现在可以看到它了。',
          class: 'w-96',
        },
        {
          actions: () => [
            h(VButton, { size: 'sm' }, () => '查看书评'),
            h(VButton, { size: 'sm', variant: 'ghost', tone: 'neutral' }, () => '回到书架'),
          ],
        },
      ),
    react: () => (
      <Result
        status="success"
        title="书评已发布"
        description="其他读者现在可以看到它了。"
        className="w-96"
        actions={
          <>
            <Button size="sm">查看书评</Button>
            <Button size="sm" variant="ghost" tone="neutral">
              回到书架
            </Button>
          </>
        }
      />
    ),
  },
  {
    name: 'error with actions',
    vue: () =>
      h(
        VResult,
        {
          status: 'error',
          title: '支付未完成',
          description: '银行没有确认这笔交易，款项不会被扣除。',
          class: 'w-96',
        },
        {
          actions: () => [
            h(VButton, { size: 'sm' }, () => '重新支付'),
            h(VButton, { size: 'sm', variant: 'ghost', tone: 'neutral' }, () => '联系客服'),
          ],
        },
      ),
    react: () => (
      <Result
        status="error"
        title="支付未完成"
        description="银行没有确认这笔交易，款项不会被扣除。"
        className="w-96"
        actions={
          <>
            <Button size="sm">重新支付</Button>
            <Button size="sm" variant="ghost" tone="neutral">
              联系客服
            </Button>
          </>
        }
      />
    ),
  },
  {
    name: 'extra content between text and actions',
    vue: () =>
      h(
        VResult,
        {
          status: 'success',
          title: '订单已提交',
          description: '我们会在发货后通知你。',
          class: 'w-96',
        },
        {
          default: () =>
            h(VText, { size: 'sm', tone: 'muted' }, () => [
              '订单号 ',
              h(VCode, () => 'HN-20260907-0412'),
            ]),
          actions: () =>
            h(VButton, { size: 'sm', variant: 'soft', tone: 'neutral' }, () => '查看订单'),
        },
      ),
    react: () => (
      <Result
        status="success"
        title="订单已提交"
        description="我们会在发货后通知你。"
        className="w-96"
        actions={
          <Button size="sm" variant="soft" tone="neutral">
            查看订单
          </Button>
        }
      >
        <Text size="sm" tone="muted">
          订单号 <Code>HN-20260907-0412</Code>
        </Text>
      </Result>
    ),
  },
  {
    name: 'custom icon slot replaces the status icon',
    vue: () =>
      h(
        VResult,
        { title: '今天的目标完成了', description: '连续第七天读满三十分钟。', class: 'w-96' },
        {
          icon: () => h('span', { class: 'avatar size-24 rounded-full' }),
          actions: () => h(VButton, { size: 'sm' }, () => '继续阅读'),
        },
      ),
    react: () => (
      <Result
        title="今天的目标完成了"
        description="连续第七天读满三十分钟。"
        className="w-96"
        icon={<span className="avatar size-24 rounded-full" />}
        actions={<Button size="sm">继续阅读</Button>}
      />
    ),
  },
  {
    name: 'unit icon and default slots with size lg',
    vue: () =>
      h(
        VResult,
        { status: 'error', title: '提交失败', size: 'lg' },
        {
          icon: () => h('svg', { class: 'custom-glyph' }),
          default: () => h('p', { class: 'detail' }, '错误代码 500'),
        },
      ),
    react: () => (
      <Result status="error" title="提交失败" size="lg" icon={<svg className="custom-glyph" />}>
        <p className="detail">错误代码 500</p>
      </Result>
    ),
  },
  ...(['sm', 'md', 'lg'] as const).flatMap(size =>
    statuses.map(entry => ({
      name: `status ${entry.status} size ${size}`,
      vue: () => h(VResult, { ...entry, size }),
      react: () => <Result {...entry} size={size} />,
    })),
  ),
  {
    name: 'title only',
    vue: () => h(VResult, { status: 'warning', title: '结果' }),
    react: () => <Result status="warning" title="结果" />,
  },
  {
    name: 'no text',
    vue: () => h(VResult, { status: 'success' }),
    react: () => <Result status="success" />,
  },
  {
    name: 'status grid demo',
    vue: () =>
      h(VGrid, { cols: 2, gap: 'md', class: 'w-full max-w-2xl' }, () =>
        statuses.map(entry => h(VResult, { ...entry, size: 'sm' })),
      ),
    react: () => (
      <Grid cols={2} gap="md" className="w-full max-w-2xl">
        {statuses.map(entry => (
          <Result key={entry.status} {...entry} size="sm" />
        ))}
      </Grid>
    ),
  },
  {
    name: 'sizes stack demo',
    vue: () =>
      h(VStack, { gap: 'lg', class: 'w-96' }, () =>
        (['sm', undefined, 'lg'] as const).map(size =>
          h(VResult, { status: 'success', size, title: '已保存', description: '改动已经生效。' }),
        ),
      ),
    react: () => (
      <Stack gap="lg" className="w-96">
        {(['sm', undefined, 'lg'] as const).map(size => (
          <Result
            key={size ?? 'md'}
            status="success"
            size={size}
            title="已保存"
            description="改动已经生效。"
          />
        ))}
      </Stack>
    ),
  },
  {
    name: 'attributes reach the root',
    vue: () => h(VResult, { title: '结果', id: 'r', 'data-x': '1', role: 'status' }),
    react: () => <Result title="结果" id="r" data-x="1" role="status" />,
  },
])
