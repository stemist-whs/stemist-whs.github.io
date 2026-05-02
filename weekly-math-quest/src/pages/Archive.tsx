import { useMemo } from "react"
// SiteNav and SiteFooter are intentionally hidden — this app is embedded in an iframe on potw.html
// import SiteNav from "@/components/SiteNav"
// import SiteFooter from "@/components/SiteFooter"
import { getArchivedWeeks, weekId } from "@/data/problems"
import { Tex } from "@/components/Math"
import Leaderboard from "@/components/Leaderboard"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"

export default function Archive() {
  const weeks = useMemo(() => getArchivedWeeks(), [])

  return (
    <div className="flex flex-col">
      <main className="flex-1">
        <section className="container py-10 md:py-12">
          <h1
            className="font-display text-4xl md:text-5xl font-bold uppercase tracking-tight"
            style={{
              background: "linear-gradient(135deg, #38bdf8, #22c55e)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Archive
          </h1>
          <p className="text-muted-foreground mt-3 text-lg">
            All previous Problems of the Week, with solutions and final leaderboards.
          </p>
        </section>

        <section className="container pb-16">
          {weeks.length === 0 ? (
            <div
              className="rounded-3xl border border-slate-400/45 p-10 text-center"
              style={{ background: "rgba(15,23,42,0.96)", boxShadow: "0 18px 45px rgba(15,23,42,0.9)" }}
            >
              <p className="text-muted-foreground">No past weeks yet — check back after the first release.</p>
            </div>
          ) : (
            <Accordion type="multiple" className="space-y-3">
              {weeks.map((w) => (
                <AccordionItem
                  key={w.week}
                  value={`w${w.week}`}
                  className="rounded-2xl border border-slate-400/45 px-5 transition-all duration-300 data-[state=open]:shadow-[0_20px_50px_rgba(56,189,248,0.15)]"
                  style={{ background: "rgba(15,23,42,0.96)" }}
                >
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3 text-left">
                      <Badge
                        className="rounded-full font-heading font-semibold text-xs uppercase tracking-wide"
                        style={{
                          background: "linear-gradient(135deg, #38bdf8, #22c55e)",
                          color: "#020617",
                          border: "none",
                        }}
                      >
                        Week {w.week}
                      </Badge>
                      <span className="font-display font-semibold text-foreground">
                        {w.title ?? `Problem set #${w.week}`}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid md:grid-cols-2 gap-6 pt-2 pb-2">
                      {(["A", "B"] as const).map((div) => {
                        const p = div === "A" ? w.divisionA : w.divisionB
                        return (
                          <div
                            key={div}
                            className="rounded-2xl border border-slate-400/30 p-5 space-y-3"
                            style={{
                              background:
                                "radial-gradient(circle at top left, rgba(56,189,248,0.08), transparent 55%), rgba(11,16,32,0.96)",
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <Badge
                                variant="secondary"
                                className="rounded-full border border-slate-400/30 text-muted-foreground"
                              >
                                Division {div}
                              </Badge>
                              <span className="text-xs text-muted-foreground">{div === "A" ? "Easier" : "Harder"}</span>
                            </div>
                            <div>
                              <h4 className="font-display font-semibold mb-1 text-foreground">Problem</h4>
                              <div className="prose max-w-none text-foreground">
                                <Tex>{p.statement}</Tex>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-display font-semibold mb-1 text-foreground">Solution</h4>
                              <div className="prose max-w-none text-foreground">
                                <Tex>{p.solution}</Tex>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Answer: <span className="font-mono text-sky-400">{p.answers[0]}</span>
                            </p>
                            <Leaderboard weekId={weekId(w.week)} division={div} />
                          </div>
                        )
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </section>
      </main>
    </div>
  )
}
