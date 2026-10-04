const script = `(function(){try{if(localStorage.getItem('hn-docs-banner:preview')==='closed')document.documentElement.setAttribute('data-docs-banner-closed','')}catch(e){}})()`

export function BannerScript() {
  return <script id="hn-docs-banner" dangerouslySetInnerHTML={{ __html: script }} />
}
