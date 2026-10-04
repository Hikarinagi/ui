import { Activity } from 'lucide-react'
import { Button, Panel, Stack, Text } from '@hina-ui/react'

const events = [
  { who: '星见书音', what: '收藏了《星之继承者》', when: '10 分钟前' },
  { who: '偷瞄', what: '评论了你的书评', when: '1 小时前' },
  { who: '玻璃', what: '关注了你', when: '昨天' },
]

export default function Demo() {
  return (
    <Panel
      title="最近活动"
      description="过去七天的动态"
      count={events.length}
      className="w-96"
      icon={<Activity />}
      actions={
        <Button size="sm" variant="ghost" tone="neutral">
          全部
        </Button>
      }
    >
      <Stack gap="sm">
        {events.map(event => (
          <Text key={event.what} size="sm">
            {event.who}
            {event.what}{' '}
            <Text as="span" tone="muted" size="sm">
              · {event.when}
            </Text>
          </Text>
        ))}
      </Stack>
    </Panel>
  )
}
