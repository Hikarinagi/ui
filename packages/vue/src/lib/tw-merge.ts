export type HnClassGroupIds = 'hn-anim' | 'hn-transition' | 'hn-press' | 'hn-scroll'

export const TW_MERGE_CONFIG = {
  extend: {
    theme: {
      text: ['md'],
      ease: ['enter', 'enter-strong', 'exit', 'move', 'press'],
    },
    classGroups: {
      'hn-anim': [
        'hn-anim-fade',
        'hn-anim-pop',
        'hn-anim-modal',
        'hn-anim-sheet-top',
        'hn-anim-sheet-bottom',
        'hn-anim-sheet-left',
        'hn-anim-sheet-right',
        'hn-anim-collapse',
      ],
      'hn-transition': ['hn-transition', 'hn-transition-base'],
      'hn-press': ['hn-press-lg', 'hn-press-none'],
      'hn-scroll': ['hn-scroll-area'],
    },
  },
}
