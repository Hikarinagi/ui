import { Center, Splitter, SplitterHandle, SplitterPanel, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Splitter className="border-line h-48 w-full max-w-xl rounded-lg border">
      <SplitterPanel defaultSize={25} minSize={15} maxSize={40}>
        <Center className="h-full px-3">
          <Stack gap="none" align="center">
            <Text size="sm" tone="muted">
              Sidebar
            </Text>
            <Text size="sm" tone="faint">
              15% – 40%
            </Text>
          </Stack>
        </Center>
      </SplitterPanel>
      <SplitterHandle />
      <SplitterPanel defaultSize={75}>
        <Center className="h-full">
          <Text size="sm" tone="muted">
            Main area
          </Text>
        </Center>
      </SplitterPanel>
    </Splitter>
  )
}
