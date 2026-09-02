export function useComponentName() {
  const { t, te, locale } = useI18n()

  return (to?: string) => {
    if (locale.value !== 'zh-CN' || !to) return undefined
    const slug = to.slice(to.lastIndexOf('/') + 1)
    const key = `names.${slug}`
    return te(key) ? t(key) : undefined
  }
}
