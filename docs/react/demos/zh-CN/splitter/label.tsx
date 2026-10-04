import { Center, Splitter, SplitterHandle, SplitterPanel, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Splitter className="border-line h-48 w-full max-w-xl rounded-lg border">
      <SplitterPanel defaultSize={35}>
        <Center className="h-full">
          <Text size="sm" tone="muted">
            目录
          </Text>
        </Center>
      </SplitterPanel>
      <SplitterHandle label="调整目录宽度" />
      <SplitterPanel defaultSize={65}>
        <Center className="h-full">
          <Text size="sm" tone="muted">
            正文
          </Text>
        </Center>
      </SplitterPanel>
    </Splitter>
  )
}
