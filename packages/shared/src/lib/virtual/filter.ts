export function createCollatorFilter(options?: Intl.CollatorOptions) {
  const collator = new Intl.Collator('en', { usage: 'search', ...options })
  return {
    startsWith(string: string, substring: string) {
      if (substring.length === 0) return true
      string = string.normalize('NFC')
      substring = substring.normalize('NFC')
      return collator.compare(string.slice(0, substring.length), substring) === 0
    },
    endsWith(string: string, substring: string) {
      if (substring.length === 0) return true
      string = string.normalize('NFC')
      substring = substring.normalize('NFC')
      return collator.compare(string.slice(-substring.length), substring) === 0
    },
    contains(string: string, substring: string) {
      if (substring.length === 0) return true
      string = string.normalize('NFC')
      substring = substring.normalize('NFC')
      for (let scan = 0; scan + substring.length <= string.length; scan++)
        if (collator.compare(substring, string.slice(scan, scan + substring.length)) === 0)
          return true
      return false
    },
  }
}
