export interface UiMessages {
  common: {
    close: string
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
}

export type PartialUiMessages = {
  [K in keyof UiMessages]?: Partial<UiMessages[K]>
}
