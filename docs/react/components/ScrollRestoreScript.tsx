import { SCROLL_AT_ATTR, SCROLL_RESTORE_ATTR, firstPaintRestoreScript } from '@hina-ui/react'

const collect = `(function(){var s=window.__hnScrollAt={};var e=document.querySelectorAll('[${SCROLL_AT_ATTR}]');for(var i=0;i<e.length;i++){s[e[i].getAttribute('${SCROLL_RESTORE_ATTR}')]=Number(e[i].getAttribute('${SCROLL_AT_ATTR}'));e[i].removeAttribute('${SCROLL_AT_ATTR}')}})()`

const script = `${firstPaintRestoreScript()};${collect}`

export function ScrollRestoreScript() {
  return <script id="hn-scroll-restore" dangerouslySetInnerHTML={{ __html: script }} />
}
