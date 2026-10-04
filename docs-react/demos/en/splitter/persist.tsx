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
              Resize, then reload
            </Text>
            <Text size="sm" tone="faint">
              The width is kept
            </Text>
          </Stack>
        </Center>
      </SplitterPanel>
      <SplitterHandle />
      <SplitterPanel defaultSize={65}>
        <Center className="h-full">
          <Text size="sm" tone="muted">
            Main area
          </Text>
        </Center>
      </SplitterPanel>
    </Splitter>
  )
}
