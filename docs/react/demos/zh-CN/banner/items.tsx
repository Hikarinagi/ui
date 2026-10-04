'use client'

import { Sparkles } from 'lucide-react'
import { Banner, Link, type BannerNotice } from '@hina-ui/react'

const notices: (BannerNotice & { text: string; link?: string })[] = [
  { text: 'Hina UI 1.2 已发布。', link: '查看更新说明' },
  { text: '本站将于 3 月 1 日 02:00 至 04:00 停机维护。', tone: 'warning' },
  { text: '周年活动进行中，全站图书限时八折。', link: '了解详情', icon: Sparkles },
]

export default function Demo() {
  return (
    <Banner
      items={notices}
      closable
      renderItem={({ item }) => (
        <>
          {item.text}
          {item.link && (
            <Link href="#" underline>
              {item.link}
            </Link>
          )}
        </>
      )}
    />
  )
}
