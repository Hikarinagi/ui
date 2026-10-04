import { AspectRatio, Card, SimpleGrid, Stack, Tag, Text } from '@hina-ui/react'

const works = [
  { title: 'ATRI', tag: '科幻' },
  { title: 'サクラノ詩', tag: '剧情' },
  { title: '天文台的午后', tag: '日常' },
  { title: '银河另一端', tag: '科幻' },
]

export default function Demo() {
  return (
    <SimpleGrid min="12rem" className="w-full max-w-2xl">
      {works.map(work => (
        <Card key={work.title}>
          <Stack gap="xs" align="start">
            <AspectRatio className="bg-inset w-full rounded-md" />
            <Text className="font-medium">{work.title}</Text>
            <Tag>{work.tag}</Tag>
          </Stack>
        </Card>
      ))}
    </SimpleGrid>
  )
}
