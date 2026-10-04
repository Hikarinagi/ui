export function affixChecklist(locale: 'zh-CN' | 'en') {
  return locale === 'zh-CN'
    ? [
        {
          title: '内容与文案',
          description: '标题清楚，错误信息给出恢复方法，空状态提供下一步入口。',
        },
        { title: '键盘操作', description: '检查 Tab 顺序、焦点可见性，以及浮层关闭后的焦点恢复。' },
        {
          title: '窄屏布局',
          description: '用较窄的窗口检查长标题、工具栏换行和内容是否横向溢出。',
        },
        {
          title: '加载与失败',
          description: '慢速网络下保留现有内容，失败后能够重试，避免清空已经填写的字段。',
        },
        {
          title: '主题与方向',
          description: '检查深色模式的对比度，以及 RTL 下图标、间距和文本的排列。',
        },
        {
          title: '首屏与水合',
          description: '刷新页面，确认内容在脚本执行前可读，水合后没有意外跳动。',
        },
      ]
    : [
        {
          title: 'Content and copy',
          description:
            'Use clear titles, actionable errors, and a useful next step in empty states.',
        },
        {
          title: 'Keyboard access',
          description:
            'Check Tab order, visible focus, and focus restoration after closing overlays.',
        },
        {
          title: 'Narrow layouts',
          description: 'Try long titles and wrapping toolbars, and check for horizontal overflow.',
        },
        {
          title: 'Loading and failure',
          description:
            'Preserve content on slow connections and let users retry without losing their input.',
        },
        {
          title: 'Theme and direction',
          description:
            'Check dark-mode contrast and the arrangement of icons, spacing, and text in RTL.',
        },
        {
          title: 'First paint and hydration',
          description:
            'Refresh the page and check that content is readable before scripts run and stays in place afterward.',
        },
      ]
}
