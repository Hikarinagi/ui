import { Heading, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="max-w-lg">
      <Heading level={1}>一级标题</Heading>
      <Heading level={2}>二级标题</Heading>
      <Heading level={3}>三级标题</Heading>
      <Heading level={4}>四级标题</Heading>
      <Heading level={5}>五级标题</Heading>
      <Heading level={6}>六级标题</Heading>
    </Stack>
  )
}
