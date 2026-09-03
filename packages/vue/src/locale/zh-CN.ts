import type { UiMessages } from './types'

export const zhCN: UiMessages = {
  tag: 'zh-CN',
  common: {
    close: '关闭',
    copy: '复制',
    copied: '已复制',
    clear: '清除',
    loading: '加载中',
    confirm: '确定',
    cancel: '取消',
  },
  pagination: {
    navLabel: '翻页',
    prev: '上一页',
    next: '下一页',
    first: '首页',
    last: '末页',
    pageLabel: n => `第 ${n} 页`,
    totalLabel: n => `共 ${n} 条`,
  },
  table: {
    empty: '暂无数据',
    loading: '加载中',
    sortAsc: '升序排列',
    sortDesc: '降序排列',
    sortNone: '取消排序',
    selectRow: '选择此行',
    selectAll: '全选',
  },
  select: {
    placeholder: '请选择',
    empty: '无匹配项',
    optionCountLabel: n => `${n} 个选项可用`,
  },
  upload: {
    choose: '选择文件',
    dropHint: '拖拽文件到此处，或点击选择',
    tooLargeLabel: readableSize => `文件超出 ${readableSize} 上限`,
    remove: '移除',
  },
  time: {
    justNow: '刚刚',
    unknown: '未知时间',
  },
  scroll: {
    regionLabel: '可滚动区域',
  },
  toast: {
    regionLabel: '通知',
  },
  spoiler: {
    revealLabel: '剧透内容，点击显示',
    hideLabel: '隐藏剧透',
  },
  codeblock: {
    copy: '复制代码',
  },
  splitter: {
    handleLabel: '调整面板大小',
  },
  sidebar: {
    navLabel: '侧边导航',
    toggleLabel: '切换侧栏',
  },
  anchor: {
    navLabel: '本页目录',
  },
  breadcrumb: {
    navLabel: '面包屑',
  },
  lightbox: {
    zoomIn: '放大',
    zoomOut: '缩小',
    resetZoom: '恢复原始大小',
    rotate: '旋转',
    download: '下载',
    loadingLarge: '正在加载原图',
  },
  chip: {
    remove: '移除',
  },
  numberInput: {
    increase: '增加',
    decrease: '减少',
  },
  passwordInput: {
    show: '显示密码',
    hide: '隐藏密码',
  },
  combobox: {
    placeholder: '输入或选择',
    toggle: '展开选项',
  },
  slider: {
    minimum: '最小值',
    maximum: '最大值',
  },
  pinInput: {
    cellLabel: (index, total) => `第 ${index} 位，共 ${total} 位`,
  },
}
