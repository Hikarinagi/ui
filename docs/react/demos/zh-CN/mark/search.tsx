import { Fragment } from 'react'
import { Mark, Stack, Text } from '@hina-ui/react'

const keyword = '航路'
const paragraph = '狼と香辛料 第一卷讲述行商人与自称丰收之神的少女同行的旅途。'
const parts = paragraph.split(keyword)

export default function Demo() {
  return (
    <Stack className="max-w-lg">
      <Text size="sm" tone="muted">
        关键词：{keyword}
      </Text>
      <Text>
        {parts.map((part, index) => (
          <Fragment key={index}>
            {part} {index < parts.length - 1 && <Mark>{keyword}</Mark>}
          </Fragment>
        ))}
      </Text>
    </Stack>
  )
}
