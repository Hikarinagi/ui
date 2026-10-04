import { dataListDemo } from './data-list'

export function masonryGallery(locale: 'en' | 'zh-CN') {
  const entries = dataListDemo(locale)
  return [0, 3, 10, 4, 1, 11].map(index => entries[index]!)
}

export function masonryNotes(locale: 'en' | 'zh-CN') {
  const notes =
    locale === 'zh-CN'
      ? [
          [
            '内容决定高度',
            '封面、标题和摘要不必裁成相同的高度。',
            '瀑布流会让每一张卡片保留自己的内容高度。展开这段说明后，后面的条目会自动让出空间。',
          ],
          [
            '给图片预留比例',
            '后端返回宽高时，直接传给 Image 的 ratio。图片下载之前就能预留空间，避免内容反复跳动。',
            '示例里的作品封面使用数据源记录的实际宽高，加载完成不会再挤动旁边的卡片。',
          ],
          [
            '按内容选布局',
            '图集适合瀑布流，逐项比较更适合 Grid 或 DataTable。',
            '当内容有很强的先后关系时，普通列表往往更易阅读。布局密度只是一个因素，浏览顺序同样重要。',
          ],
          [
            '稳定的条目标识',
            '使用业务 id 作为 key。',
            '追加数据时保留已有卡片；重新排序时也保留卡片内部的展开状态和仍然存在的焦点节点。',
          ],
          [
            '跟随容器变化',
            '侧栏开关、分栏调整和窗口缩放都会改变可用宽度，列数跟着容器走。',
            '这里不依赖视口断点。窄到放不下最小列宽时，自动退到一列，卡片不会横向溢出。',
          ],
          [
            '让内容自然展开',
            '详情使用 Collapsible，布局跟随真实高度更新。',
            '试试同时展开几个条目，再缩窄窗口。组件监听条目尺寸，展开、折叠和文本换行都不需要手动通知。',
          ],
        ]
      : [
          [
            'Let content set the height',
            'Covers, titles and summaries do not need matching heights.',
            'Each card keeps its natural content height. Expand this note and the following cards automatically make room.',
          ],
          [
            'Reserve image space',
            'When the API provides dimensions, pass their ratio to Image. Space is reserved before the image downloads.',
            'The gallery uses the actual dimensions in its source data, so downloading an image does not push neighboring cards around.',
          ],
          [
            'Choose a layout for the task',
            'Masonry suits a gallery; Grid or DataTable is better for direct comparisons.',
            'A regular list is often easier to read when the order is essential. Density is only one part of choosing a useful layout.',
          ],
          [
            'Keep stable item keys',
            'Use the business id as the key.',
            'Appending preserves existing cards. Reordering also preserves their expanded state and any focused element that still exists.',
          ],
          [
            'Follow the container',
            'Sidebars, split panes and window resizing all change the space available to the gallery.',
            'Columns follow the container rather than viewport breakpoints. A narrow container uses one column without horizontal overflow.',
          ],
          [
            'Expand content naturally',
            'Details use Collapsible. The layout follows the actual height.',
            'Try opening a few notes and then narrowing the window. Resize observation handles expansion, collapse and wrapped text automatically.',
          ],
        ]
  return notes.map(([title, body, detail], id) => ({
    id,
    title: title!,
    body: body!,
    detail: detail!,
  }))
}
