import { Center, Splitter, SplitterHandle, SplitterPanel, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Splitter direction="vertical" className="border-line h-64 w-full max-w-xl rounded-lg border">
      <SplitterPanel defaultSize={40}>
        <Center className="h-full">
          <Text size="sm" tone="muted">
            上方面板
          </Text>
        </Center>
      </SplitterPanel>
      <SplitterHandle />
      <SplitterPanel defaultSize={60}>
        <Center className="h-full">
          <Text size="sm" tone="muted">
            下方面板
          </Text>
        </Center>
      </SplitterPanel>
    </Splitter>
  )
}
