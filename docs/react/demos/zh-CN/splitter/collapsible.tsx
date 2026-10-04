import { Center, Splitter, SplitterHandle, SplitterPanel, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Splitter className="border-line h-48 w-full max-w-xl rounded-lg border">
      <SplitterPanel collapsible collapsedSize={0} defaultSize={28} minSize={18}>
        <Center className="h-full px-3">
          <Text size="sm" tone="muted">
            向左拖至边缘即可收起
          </Text>
        </Center>
      </SplitterPanel>
      <SplitterHandle />
      <SplitterPanel defaultSize={72}>
        <Center className="h-full">
          <Text size="sm" tone="muted">
            主区域
          </Text>
        </Center>
      </SplitterPanel>
    </Splitter>
  )
}
