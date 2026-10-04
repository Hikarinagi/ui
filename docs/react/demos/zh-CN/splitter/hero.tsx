import { Card, Splitter, SplitterHandle, SplitterPanel, Stack, Text } from '@hina-ui/react'

const chapters = ['第 I 章', '第 II 章', '第 III 章']

export default function Demo() {
  return (
    <Card padded={false} className="w-full max-w-2xl overflow-hidden">
      <Splitter className="h-64">
        <SplitterPanel defaultSize={32} minSize={20}>
          <Stack gap="xs" className="p-4">
            <Text size="sm" tone="faint">
              目录
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
              正文
            </Text>
            <Text size="sm">拖动中间的分隔线可以调整两侧的宽度。</Text>
          </Stack>
        </SplitterPanel>
      </Splitter>
    </Card>
  )
}
