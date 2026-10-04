import { BookOpen, Clock, Users } from 'lucide-react'
import { Card, Grid, Statistic } from '@hina-ui/react'

export default function Demo() {
  return (
    <Grid cols={3} gap="md" className="w-full max-w-3xl">
      <Card>
        <Statistic
          label="本月阅读页数"
          value={12480}
          delta={0.12}
          deltaLabel="较上月"
          icon={<BookOpen />}
        />
      </Card>
      <Card>
        <Statistic
          label="阅读时长"
          value={36.5}
          suffix="小时"
          delta={-0.08}
          deltaLabel="较上月"
          icon={<Clock />}
        />
      </Card>
      <Card>
        <Statistic label="新增关注" value={212} delta={0.31} deltaLabel="较上月" icon={<Users />} />
      </Card>
    </Grid>
  )
}
