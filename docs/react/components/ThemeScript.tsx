const script = `(function(){try{var k='hn-docs-color-mode';var p=localStorage.getItem(k)||'system';var d=p==='dark'||(p==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d)}catch(e){}})()`

export function ThemeScript() {
  return <script id="hn-color-mode" dangerouslySetInnerHTML={{ __html: script }} />
}
