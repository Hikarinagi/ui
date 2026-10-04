import { Center, Splitter, SplitterHandle, SplitterPanel, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Splitter className="border-line h-48 w-full max-w-xl rounded-lg border">
      <SplitterPanel>
        <Center className="h-full">
          <Text size="sm" tone="muted">
            左侧面板
          </Text>
        </Center>
      </SplitterPanel>
      <SplitterHandle />
      <SplitterPanel>
        <Center className="h-full">
          <Text size="sm" tone="muted">
            右侧面板
          </Text>
        </Center>
      </SplitterPanel>
    </Splitter>
  )
}
