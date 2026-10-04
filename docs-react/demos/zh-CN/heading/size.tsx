import { Heading, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="max-w-lg">
      <Heading level={3} size="2xl">
        三级标题，一级字号
      </Heading>
      <Heading level={1} size="base">
        一级标题，正文字号
      </Heading>
    </Stack>
  )
}
