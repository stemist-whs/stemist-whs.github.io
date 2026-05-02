import { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { Trophy } from "lucide-react"

type Row = { name: string; solved_at: string }

export default function Leaderboard({
  weekId,
  division,
  refreshKey = 0,
}: { weekId: string; division: "A" | "B"; refreshKey?: number }) {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    setLoading(true)
    supabase
      .from("submissions")
      .select("name, solved_at")
      .eq("week_id", weekId)
      .eq("division", division)
      .order("solved_at", { ascending: true })
      .limit(100)
      .then(({ data }) => {
        if (!active) return
        setRows(data ?? [])
        setLoading(false)
      })

    const channel = supabase
      .channel(`leaderboard-${weekId}-${division}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "submissions", filter: `week_id=eq.${weekId}` },
        (payload) => {
          const r = payload.new as { division: string; name: string; solved_at: string }
          if (r.division === division) {
            setRows((prev) => [...prev, { name: r.name, solved_at: r.solved_at }])
          }
        }
      )
      .subscribe()

    return () => {
      active = false
      supabase.removeChannel(channel)
    }
  }, [weekId, division, refreshKey])

  return (
    <div
      className="rounded-2xl border border-slate-400/45 p-5"
      style={{
        background: "radial-gradient(circle at top, rgba(56,189,248,0.1), transparent 60%), rgba(15,23,42,0.96)",
        boxShadow: "0 18px 45px rgba(15,23,42,0.9)",
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Trophy className="w-4 h-4 text-accent" />
        <h3 className="font-display font-semibold">Leaderboard — Division {division}</h3>
      </div>
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">Be the first to solve it!</p>
      ) : (
        <ol className="space-y-1">
          {rows.map((r, i) => (
            <li
              key={`${r.name}-${r.solved_at}`}
              className="flex items-center justify-between text-sm py-1.5 px-2 rounded-lg odd:bg-secondary/40"
            >
              <span className="flex items-center gap-3">
                <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                  i === 0 ? "bg-gradient-accent text-accent-foreground" :
                  i === 1 ? "bg-secondary text-secondary-foreground" :
                  i === 2 ? "bg-secondary/70 text-secondary-foreground" :
                  "bg-muted text-muted-foreground"
                }`}>{i + 1}</span>
                <span className="font-medium">{r.name}</span>
              </span>
              <span className="text-xs text-muted-foreground">
                {new Date(r.solved_at).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}