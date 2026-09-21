export function monthGridSchedule(locale: 'zh-CN' | 'en') {
  const titles =
    locale === 'zh-CN'
      ? [
          '需求讨论',
          '交互评审',
          '键盘走查',
          '文档校对',
          '组件评审',
          '主题验收',
          '发布准备',
          '版本回顾',
        ]
      : [
          'Requirements',
          'Design review',
          'Keyboard review',
          'Docs review',
          'Component review',
          'Theme checks',
          'Release prep',
          'Retrospective',
        ]
  return [
    2, 3, 3, 7, 8, 10, 10, 11, 14, 16, 17, 18, 21, 21, 21, 21, 21, 22, 23, 24, 24, 25, 28, 29,
  ].map((day, index) => ({
    id: index,
    date: `2026-09-${String(day).padStart(2, '0')}`,
    time: `${String(9 + (index % 5) * 2).padStart(2, '0')}:00`,
    title: titles[index % titles.length]!,
    kind: index % 3 === 0 ? 'release' : 'design',
  }))
}

export function monthGridPrices() {
  return Object.fromEntries(
    Array.from({ length: 30 }, (_, index) => {
      const day = index + 1
      return [
        `2026-09-${String(day).padStart(2, '0')}`,
        {
          price: 380 + (day % 5) * 40,
          rooms: [23, 26, 27].includes(day) ? 0 : (day % 4) + 1,
        },
      ]
    }),
  )
}
