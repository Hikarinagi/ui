import { Card, Splitter, SplitterHandle, SplitterPanel, Stack, Text } from '@hina-ui/react'

const chapters = ['1. The Summer Door', '2. Cicada Rain', '3. Distant Thunder']

export default function Demo() {
  return (
    <Card padded={false} className="w-full max-w-2xl overflow-hidden">
      <Splitter className="h-64">
        <SplitterPanel defaultSize={32} minSize={20}>
          <Stack gap="xs" className="p-4">
            <Text size="sm" tone="faint">
              Contents
            </Text>
            {chapters.map(chapter => (
              <Text key={chapter} size="sm">
                {chapter}
              </Text>
            ))}
          </Stack>
        </SplitterPanel>
        <SplitterHandle />
        <SplitterPanel defaultSize={68}>
          <Stack gap="sm" className="p-4">
            <Text size="sm" tone="faint">
              Body
            </Text>
            <Text size="sm">Drag the divider to resize the two sides.</Text>
          </Stack>
        </SplitterPanel>
      </Splitter>
    </Card>
  )
}
