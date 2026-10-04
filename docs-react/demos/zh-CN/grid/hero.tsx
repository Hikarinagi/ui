import { AspectRatio, Card, Grid, Stack, Tag, Text } from '@hina-ui/react'

const works = [
  { title: 'ATRI', tag: '科幻' },
  { title: 'サクラノ詩', tag: '剧情' },
  { title: '天文台的午后', tag: '日常' },
  { title: '银河另一端', tag: '科幻' },
  { title: '书页之间', tag: '校园' },
  { title: '静谧的信号', tag: '治愈' },
]

export default function Demo() {
  return (
    <Grid cols={3} className="w-full max-w-2xl">
      {works.map(work => (
        <Card key={work.title}>
          <Stack gap="xs" align="start">
            <AspectRatio className="bg-inset w-full rounded-md" />
            <Text className="font-medium">{work.title}</Text>
            <Tag>{work.tag}</Tag>
          </Stack>
        </Card>
      ))}
    </Grid>
  )
}
