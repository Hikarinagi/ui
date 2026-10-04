import { AspectRatio, Card, Grid, Stack, Tag, Text } from '@hina-ui/react'

const works = [
  { title: 'ATRI', tag: 'Sci-fi' },
  { title: 'Sakura no Uta', tag: 'Drama' },
  { title: 'Afternoon at the Observatory', tag: 'Slice of life' },
  { title: 'The Other Side of the Galaxy', tag: 'Sci-fi' },
  { title: 'Between the Pages', tag: 'School' },
  { title: 'A Quiet Signal', tag: 'Healing' },
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
