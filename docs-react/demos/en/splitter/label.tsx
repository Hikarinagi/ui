import { Center, Splitter, SplitterHandle, SplitterPanel, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Splitter className="border-line h-48 w-full max-w-xl rounded-lg border">
      <SplitterPanel defaultSize={35}>
        <Center className="h-full">
          <Text size="sm" tone="muted">
            Contents
          </Text>
        </Center>
      </SplitterPanel>
      <SplitterHandle label="Resize the contents pane" />
      <SplitterPanel defaultSize={65}>
        <Center className="h-full">
          <Text size="sm" tone="muted">
            Body
          </Text>
        </Center>
      </SplitterPanel>
    </Splitter>
  )
}
