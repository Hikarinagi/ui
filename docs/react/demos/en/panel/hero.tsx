import { Activity } from 'lucide-react'
import { Button, Panel, Stack, Text } from '@hina-ui/react'

const events = [
  { who: 'Hoshimi Shion', what: ' bookmarked Inherit the Stars', when: '10 minutes ago' },
  { who: 'Peek', what: ' commented on your review', when: '1 hour ago' },
  { who: 'Glass', what: ' followed you', when: 'yesterday' },
]

export default function Demo() {
  return (
    <Panel
      title="Recent activity"
      description="What happened in the last seven days"
      count={events.length}
      className="w-96"
      icon={<Activity />}
      actions={
        <Button size="sm" variant="ghost" tone="neutral">
          All
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
