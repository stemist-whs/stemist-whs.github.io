import { useEffect, useMemo, useRef, useState } from "react"
import { Tex, AsciiTex } from "./Math"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Problem } from "@/data/problems"
import { CheckCircle2, XCircle, Flag, Loader2, Lock } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { getClientId } from "@/lib/clientId"
import { toast } from "sonner"
import Leaderboard from "./Leaderboard"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const COOLDOWN_MS = 60_000

type LocalState = {
  solved?: boolean
  gaveUp?: boolean
  lastAttemptAt?: number
}

function loadState(weekId: string, division: "A" | "B"): LocalState {
  try {
    const raw = localStorage.getItem(`potw:${weekId}:${division}`)
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}
function saveState(weekId: string, division: "A" | "B", s: LocalState) {
  localStorage.setItem(`potw:${weekId}:${division}`, JSON.stringify(s))
}

export default function ProblemPanel({
  weekId,
  division,
  problem,
}: { weekId: string; division: "A" | "B"; problem: Problem }) {
  const [name, setName] = useState(() => localStorage.getItem("potw:name") ?? "")
  const [answer, setAnswer] = useState("")
  const [state, setState] = useState<LocalState>(() => loadState(weekId, division))
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null)
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [refreshLb, setRefreshLb] = useState(0)
  const tickRef = useRef<number | null>(null)

  // Reset state when week/division changes
  useEffect(() => {
    setState(loadState(weekId, division))
    setAnswer("")
    setFeedback(null)
  }, [weekId, division])

  // Cooldown ticker
  useEffect(() => {
    function update() {
      if (!state.lastAttemptAt) { setSecondsLeft(0); return }
      const remaining = Math.max(0, state.lastAttemptAt + COOLDOWN_MS - Date.now())
      setSecondsLeft(Math.ceil(remaining / 1000))
    }
    update()
    tickRef.current = window.setInterval(update, 500)
    return () => { if (tickRef.current) window.clearInterval(tickRef.current) }
  }, [state.lastAttemptAt])

  const locked = state.solved || state.gaveUp
  const onCooldown = secondsLeft > 0 && !state.solved

  async function submit() {
    if (!name.trim()) {
      toast.error("Please enter your name first.")
      return
    }
    if (!answer.trim()) {
      toast.error("Please enter an answer.")
      return
    }
    if (locked || onCooldown || submitting) return

    setSubmitting(true)
    localStorage.setItem("potw:name", name.trim())
    try {
      const { data, error } = await supabase.functions.invoke("check-answer", {
        body: {
          weekId,
          division,
          userAnswer: answer,
          acceptedAnswers: problem.answers,
          name: name.trim(),
          clientId: getClientId(),
        },
      })
      if (error) throw error
      if (data?.correct) {
        const next = { ...state, solved: true, lastAttemptAt: Date.now() }
        setState(next); saveState(weekId, division, next)
        setFeedback("correct")
        setRefreshLb((k) => k + 1)
        toast.success("Correct! Added to the leaderboard 🎉")
      } else {
        const next = { ...state, lastAttemptAt: Date.now() }
        setState(next); saveState(weekId, division, next)
        setFeedback("wrong")
        toast.error("Not quite — try again in 60s.")
      }
    } catch (e) {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  function giveUp() {
    if (locked) return
    const ok = window.confirm("Give up? You won't be able to submit again this week, and the solution will be revealed.")
    if (!ok) return
    const next = { ...state, gaveUp: true }
    setState(next); saveState(weekId, division, next)
    setFeedback(null)
  }

  const showSolution = state.solved || state.gaveUp

  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-6">
      <div
        className="rounded-3xl border border-slate-400/45 p-6 md:p-8"
        style={{
          background:
            "radial-gradient(circle at top left, rgba(56,189,248,0.1), transparent 55%), rgba(15,23,42,0.96)",
          boxShadow: "0 18px 45px rgba(15,23,42,0.9)",
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="secondary" className="rounded-full">
            Division {division} · {division === "A" ? "Easier" : "Harder"}
          </Badge>
          {state.solved && <Badge className="rounded-full bg-success/15 text-success hover:bg-success/15">Solved</Badge>}
          {state.gaveUp && !state.solved && <Badge variant="outline" className="rounded-full">Gave up</Badge>}
        </div>

        <div className="prose prose-invert max-w-none mb-6 text-foreground">
          <Tex>{problem.statement}</Tex>
        </div>

        {!locked && (
          <div className="space-y-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="name" className="mb-1.5 block">Your name</Label>
                <Input
                  id="name" value={name} onChange={(e) => setName(e.target.value)}
                  maxLength={50} placeholder="Ada Lovelace"
                />
              </div>
              <div>
                <Label htmlFor="answer" className="mb-1.5 block">Your answer (LaTeX or plain)</Label>
                <Input
                  id="answer" value={answer} onChange={(e) => setAnswer(e.target.value)}
                  placeholder={"e.g. \\frac{5}{6} or 5/6"}
                  onKeyDown={(e) => { if (e.key === "Enter") submit() }}
                  maxLength={200}
                />
              </div>
            </div>
            {answer && (
              <div className="text-sm text-muted-foreground">
                Preview: <span className="text-foreground"><AsciiTex>{answer}</AsciiTex></span>
              </div>
            )}
            <Accordion type="single" collapsible className="rounded-2xl border border-border bg-secondary/30 px-4">
              <AccordionItem value="help" className="border-none">
                <AccordionTrigger className="text-sm py-3 hover:no-underline">
                  How to format your answer
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground pb-4">
                  <p className="mb-2">
                    You can type answers as a plain number, LaTeX, or AsciiMath. The grader checks both the exact text and the numeric value (to ~10 decimal places).
                  </p>
                  <ul className="space-y-1.5">
                    <li><span className="font-medium text-foreground">Plain number:</span> <code className="font-mono">1500</code>, <code className="font-mono">0.5</code>, <code className="font-mono">-3/4</code></li>
                    <li><span className="font-medium text-foreground">Fractions:</span> <code className="font-mono">5/6</code> or LaTeX <code className="font-mono">{`\\frac{5}{6}`}</code></li>
                    <li><span className="font-medium text-foreground">Square root:</span> <code className="font-mono">sqrt(4)</code> or LaTeX <code className="font-mono">{`\\sqrt{4}`}</code> (not <code className="font-mono">sqrt4</code>)</li>
                    <li><span className="font-medium text-foreground">nth root:</span> <code className="font-mono">nthRoot(8,3)</code> or <code className="font-mono">{`\\sqrt[3]{8}`}</code></li>
                    <li><span className="font-medium text-foreground">Exponents:</span> <code className="font-mono">2^10</code> or <code className="font-mono">{`2^{10}`}</code></li>
                    <li><span className="font-medium text-foreground">Multiply:</span> <code className="font-mono">3*4</code>, <code className="font-mono">{`3\\cdot 4`}</code>, or <code className="font-mono">{`3\\times 4`}</code></li>
                    <li><span className="font-medium text-foreground">Constants:</span> <code className="font-mono">pi</code>, <code className="font-mono">e</code> (or <code className="font-mono">{`\\pi`}</code>)</li>
                    <li><span className="font-medium text-foreground">Functions:</span> <code className="font-mono">sin(x)</code>, <code className="font-mono">cos(x)</code>, <code className="font-mono">log(x)</code>, <code className="font-mono">ln(x)</code></li>
                  </ul>
                  <p className="mt-3">Wrap groups in parentheses when in doubt — e.g. <code className="font-mono">(1+sqrt(5))/2</code>.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <Button onClick={submit} disabled={submitting || onCooldown} className="rounded-full bg-gradient-primary hover:opacity-90">
                {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                {onCooldown ? `Wait ${secondsLeft}s` : "Submit answer"}
              </Button>
              <Button onClick={giveUp} variant="outline" className="rounded-full">
                <Flag className="w-4 h-4 mr-2" /> Give up
              </Button>
              {feedback === "wrong" && (
                <span className="inline-flex items-center text-sm text-destructive">
                  <XCircle className="w-4 h-4 mr-1" /> Incorrect — try again
                </span>
              )}
              {feedback === "correct" && (
                <span className="inline-flex items-center text-sm text-success">
                  <CheckCircle2 className="w-4 h-4 mr-1" /> Correct!
                </span>
              )}
            </div>
          </div>
        )}

        {locked && (
          <div className={`rounded-2xl p-4 mb-4 border ${state.solved ? "bg-success/10 border-success/30" : "bg-muted border-border"}`}>
            <div className="flex items-center gap-2 font-semibold">
              {state.solved ? <CheckCircle2 className="w-5 h-5 text-success" /> : <Lock className="w-5 h-5 text-muted-foreground" />}
              {state.solved ? "You solved it!" : "Solution revealed"}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {state.solved ? "Nice work — you've been added to the leaderboard." : "You've ended this attempt; you can no longer submit for this problem."}
            </p>
          </div>
        )}

        {showSolution && (
          <div className="mt-2">
            <h3 className="font-display font-semibold mb-2">Solution</h3>
            <div className="prose prose-invert max-w-none text-foreground rounded-2xl bg-secondary/40 p-4">
              <Tex>{problem.solution}</Tex>
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              Accepted answer{problem.answers.length > 1 ? "s" : ""}: <span className="font-mono">{problem.answers.join(" , ")}</span>
            </p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <Leaderboard weekId={weekId} division={division} refreshKey={refreshLb} />
      </div>
    </div>
  )
}