import { CodeBlock } from '@hina-ui/react'

const source = `import { createRoot } from 'react-dom/client'
import App from './App'
import '@hina-ui/react/styles/tokens.css'

createRoot(document.getElementById('app')!).render(<App />)`

export default function Demo() {
  return <CodeBlock code={source} lang="tsx" className="w-full max-w-xl" />
}
