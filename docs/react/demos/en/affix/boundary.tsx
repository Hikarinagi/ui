import { Affix, Card, Heading, ScrollArea, Stack, Text } from '@hina-ui/react'
import { affixChecklist } from '../../affix'

const items = affixChecklist('en')
const groups = [
  { title: 'Design and content', items: items.slice(0, 3) },
  { title: 'Runtime and adaptation', items: items.slice(3) },
]

export default function Demo() {
  return (
    <Stack className="w-full max-w-xl" gap="sm">
      <Text size="sm" tone="muted">
        Each heading stays inside its own section. The previous heading leaves as the next section
        arrives.
      </Text>
      <Card padded={false}>
        <ScrollArea className="h-72" shadow={false} focusable label="Grouped review notes">
          <Stack gap="none">
            {groups.map(group => (
              <Stack key={group.title} gap="none">
                <Affix>
                  <Heading
                    level={3}
                    size="sm"
                    className="bg-surface border-line border-b px-4 py-3"
                  >
                    {group.title}
                  </Heading>
                </Affix>
                {group.items.map(item => (
                  <Stack key={item.title} className="p-4" gap="sm">
                    <Text size="sm" weight="medium">
                      {item.title}
                    </Text>
                    <Text size="sm" tone="muted">
                      {item.description}
                    </Text>
                  </Stack>
                ))}
              </Stack>
            ))}
          </Stack>
        </ScrollArea>
      </Card>
    </Stack>
  )
}
