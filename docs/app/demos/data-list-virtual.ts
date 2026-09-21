import snapshot from '../../public/demo/data-list/virtual.json'
import { dataListDemo } from './data-list'

export function dataListVirtualDemo(locale: 'en' | 'zh-CN') {
  return dataListDemo(locale, snapshot.items)
}
