'use client'

import { Banner } from '@hina-ui/react'

const notices = [
  { text: '新增书评 86 条，活跃读者 1,204 人。' },
  { text: '本周最受欢迎的作品是《狼と香辛料》。' },
  { text: '书架支持按标签筛选了。' },
]

export default function Demo() {
  return <Banner items={notices} autoplay={4000} tone="info" renderItem={({ item }) => item.text} />
}
