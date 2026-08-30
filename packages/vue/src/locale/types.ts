export interface UiMessages {
  tag: string
  common: {
    close: string
    copy: string
    copied: string
    clear: string
    loading: string
    confirm: string
    cancel: string
  }
  pagination: {
    prev: string
    next: string
    first: string
    last: string
    pageLabel: (n: number) => string
    totalLabel: (n: number) => string
  }
  table: {
    empty: string
    loading: string
    sortAsc: string
    sortDesc: string
    sortNone: string
    selectRow: string
    selectAll: string
  }
  select: {
    placeholder: string
    empty: string
    optionCountLabel: (n: number) => string
  }
  upload: {
    choose: string
    dropHint: string
    tooLargeLabel: (readableSize: string) => string
    remove: string
  }
  time: {
    justNow: string
    unknown: string
  }
  scroll: {
    regionLabel: string
  }
  toast: {
    regionLabel: string
  }
  spoiler: {
    revealLabel: string
    hideLabel: string
  }
  codeblock: {
    copy: string
  }
  splitter: {
    handleLabel: string
  }
  sidebar: {
    navLabel: string
    toggleLabel: string
  }
  anchor: {
    navLabel: string
  }
  breadcrumb: {
    navLabel: string
  }
}

export type PartialUiMessages = {
  [K in keyof UiMessages]?: UiMessages[K] extends object ? Partial<UiMessages[K]> : UiMessages[K]
}
