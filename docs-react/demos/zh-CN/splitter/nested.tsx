import { Center, Splitter, SplitterHandle, SplitterPanel, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Splitter className="border-line h-64 w-full max-w-xl rounded-lg border">
      <SplitterPanel defaultSize={30} minSize={20}>
        <Center className="h-full">
          <Text size="sm" tone="muted">
            目录
          </Text>
        </Center>
      </SplitterPanel>
      <SplitterHandle />
      <SplitterPanel defaultSize={70}>
        <Splitter direction="vertical" className="h-full">
          <SplitterPanel defaultSize={65}>
            <Center className="h-full">
              <Text size="sm" tone="muted">
                编辑
              </Text>
            </Center>
          </SplitterPanel>
          <SplitterHandle />
          <SplitterPanel defaultSize={35}>
            <Center className="h-full">
              <Text size="sm" tone="muted">
                预览
              </Text>
            </Center>
          </SplitterPanel>
        </Splitter>
      </SplitterPanel>
    </Splitter>
  )
}
