import { Center, Splitter, SplitterHandle, SplitterPanel, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Splitter direction="vertical" className="border-line h-64 w-full max-w-xl rounded-lg border">
      <SplitterPanel defaultSize={40}>
        <Center className="h-full">
          <Text size="sm" tone="muted">
            Top panel
          </Text>
        </Center>
      </SplitterPanel>
      <SplitterHandle />
      <SplitterPanel defaultSize={60}>
        <Center className="h-full">
          <Text size="sm" tone="muted">
            Bottom panel
          </Text>
        </Center>
      </SplitterPanel>
    </Splitter>
  )
}
