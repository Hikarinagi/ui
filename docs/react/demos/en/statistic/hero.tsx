import { BookOpen, Clock, Users } from 'lucide-react'
import { Card, Grid, Statistic } from '@hina-ui/react'

export default function Demo() {
  return (
    <Grid cols={3} gap="md" className="w-full max-w-3xl">
      <Card>
        <Statistic
          label="Pages this month"
          value={12480}
          delta={0.12}
          deltaLabel="vs last month"
          icon={<BookOpen />}
        />
      </Card>
      <Card>
        <Statistic
          label="Reading time"
          value={36.5}
          suffix="h"
          delta={-0.08}
          deltaLabel="vs last month"
          icon={<Clock />}
        />
      </Card>
      <Card>
        <Statistic
          label="New followers"
          value={212}
          delta={0.31}
          deltaLabel="vs last month"
          icon={<Users />}
        />
      </Card>
    </Grid>
  )
}
