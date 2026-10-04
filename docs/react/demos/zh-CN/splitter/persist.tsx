import { Center, Splitter, SplitterHandle, SplitterPanel, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Splitter
      autoSaveId="hina-docs-splitter-demo"
      className="border-line h-48 w-full max-w-xl rounded-lg border"
    >
      <SplitterPanel defaultSize={35} minSize={20}>
        <Center className="h-full px-3">
          <Stack gap="none" align="center">
            <Text size="sm" tone="muted">
              调整后刷新页面
            </Text>
            <Text size="sm" tone="faint">
              宽度会保留
            </Text>
          </Stack>
        </Center>
      </SplitterPanel>
      <SplitterHandle />
      <SplitterPanel defaultSize={65}>
        <Center className="h-full">
          <Text size="sm" tone="muted">
            主区域
          </Text>
        </Center>
      </SplitterPanel>
    </Splitter>
  )
}
