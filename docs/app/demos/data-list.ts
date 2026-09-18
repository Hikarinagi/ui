import snapshot from '../../public/demo/data-list.json'

export type DataListDemoItem = (typeof snapshot.items)[number] & { subtitle: string }
export function dataListDemo(
  locale: 'en' | 'zh-CN',
  extra: readonly Omit<DataListDemoItem, 'subtitle'>[] = [],
): DataListDemoItem[] {
  return [...snapshot.items, ...extra].map(item => ({
    ...item,
    title: locale === 'en' ? item.originalTitle : item.title,
    subtitle:
      locale === 'en'
        ? item.title === item.originalTitle
          ? ''
          : item.title
        : item.title === item.originalTitle
          ? ''
          : item.originalTitle,
  }))
}
