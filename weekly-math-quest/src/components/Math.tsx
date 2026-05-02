import { MathJaxContext, MathJax } from "better-react-mathjax"
import { ReactNode } from "react"

const config = {
  loader: { load: ["input/asciimath", "[tex]/ams", "[tex]/boldsymbol"] },
  tex: {
    packages: { "[+]": ["ams", "boldsymbol"] },
    inlineMath: [["$", "$"], ["\\(", "\\)"]],
    displayMath: [["$$", "$$"], ["\\[", "\\]"]],
  },
  asciimath: {
    delimiters: [["`", "`"]],
  },
  options: {
    enableMenu: false,
  },
}

export function MathProvider({ children }: { children: ReactNode }) {
  return (
    <MathJaxContext
      version={3}
      config={config}
      src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"
    >
      {children}
    </MathJaxContext>
  )
}

export function Tex({ children, className }: { children: string; className?: string }) {
  return (
    <MathJax dynamic className={className}>
      {children}
    </MathJax>
  )
}

/** Render a raw AsciiMath string (no delimiters needed). */
export function AsciiTex({ children, className }: { children: string; className?: string }) {
  // Escape backticks so they don't break the delimiter
  const safe = children.replace(/`/g, "")
  return (
    <MathJax dynamic className={className}>
      {`\`${safe}\``}
    </MathJax>
  )
}