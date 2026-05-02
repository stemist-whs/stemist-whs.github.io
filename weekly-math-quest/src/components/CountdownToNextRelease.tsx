import { useEffect, useState } from "react"
import { getNextReleaseDate } from "@/data/problems"
import { Clock } from "lucide-react"

function fmt(ms: number) {
  if (ms <= 0) return "0d 00h 00m 00s"
  const s = Math.floor(ms / 1000)
  const d = Math.floor(s / 86400)
  const h = Math.floor((s % 86400) / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return `${d}d ${String(h).padStart(2, "0")}h ${String(m).padStart(2, "0")}m ${String(sec).padStart(2, "0")}s`
}

export default function CountdownToNextRelease() {
  const [text, setText] = useState("")
  useEffect(() => {
    const tick = () => {
      const next = getNextReleaseDate()
      setText(fmt(next.getTime() - Date.now()))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-slate-400/30 bg-secondary/60 backdrop-blur px-4 py-1.5 text-sm">
      <Clock className="w-4 h-4 text-sky-400" />
      <span className="text-muted-foreground">Next problem in</span>
      <span className="font-mono font-semibold text-sky-400">{text}</span>
    </div>
  )
}