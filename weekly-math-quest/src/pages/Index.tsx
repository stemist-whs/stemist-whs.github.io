import { useMemo, useState } from "react";
// SiteNav and SiteFooter are intentionally hidden — this app is embedded in an iframe on potw.html
// import SiteNav from "@/components/SiteNav";
// import SiteFooter from "@/components/SiteFooter";
import ProblemPanel from "@/components/ProblemPanel";
import CountdownToNextRelease from "@/components/CountdownToNextRelease";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCurrentWeek, weekId } from "@/data/problems";
import { Sparkles } from "lucide-react";

const Index = () => {
  const week = useMemo(() => getCurrentWeek(), []);
  const [tab, setTab] = useState<"A" | "B">("A");

  return (
    <div className="flex flex-col">
      <main className="flex-1">
        <section className="relative overflow-hidden py-10 md:py-10">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at top left, rgba(56,189,248,0.12) 0%, rgba(34,197,94,0.08) 35%, transparent 65%)",
            }}
          />
          <div className="container relative text-center">
            <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-widest border border-slate-400/30 bg-secondary/60 backdrop-blur text-muted-foreground">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" /> STEMist Mathathon
            </span>
            <h1
              className="mt-5 font-display text-4xl md:text-5xl font-bold tracking-tight uppercase"
              style={{
                background: "linear-gradient(135deg, #38bdf8, #22c55e)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Problem of the Week
            </h1>
            <p className="mt-5 max-w-2xl mx-auto text-muted-foreground md:text-lg leading-relaxed">
              The new Problem of the Week drops every Sunday. It's great practice for the STEMist Mathathon: just choose
              the problem from your division and give it a try! However, feel free to try both problems if you'd like!
            </p>
            <div className="mt-6 flex justify-center">
              <CountdownToNextRelease />
            </div>
          </div>
        </section>

        <section className="container pb-16 pt-4">
          {!week ? (
            <div
              className="rounded-3xl border border-slate-400/45 p-10 text-center"
              style={{ background: "rgba(15,23,42,0.96)", boxShadow: "0 18px 45px rgba(15,23,42,0.9)" }}
            >
              <h2 className="font-display text-2xl font-semibold">The season hasn't started yet.</h2>
              <p className="text-muted-foreground mt-2">
                Come back at the first release date — the countdown above is ticking.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
                <div>
                  <h2 className="font-display text-2xl font-semibold text-foreground">Week {week.week}</h2>
                  {week.title && <p className="text-muted-foreground mt-1">{week.title}</p>}
                </div>
              </div>
              <Tabs value={tab} onValueChange={(v) => setTab(v as "A" | "B")}>
                <TabsList className="rounded-full p-1 border border-slate-400/30 bg-secondary/60 mb-6">
                  <TabsTrigger value="A" className="rounded-full px-5 data-[state=active]:bg-gradient-to-br data-[state=active]:from-sky-400/20 data-[state=active]:to-green-400/10">
                    Division A · Easier
                  </TabsTrigger>
                  <TabsTrigger value="B" className="rounded-full px-5 data-[state=active]:bg-gradient-to-br data-[state=active]:from-sky-400/20 data-[state=active]:to-green-400/10">
                    Division B · Harder
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="A">
                  <ProblemPanel weekId={weekId(week.week)} division="A" problem={week.divisionA} />
                </TabsContent>
                <TabsContent value="B">
                  <ProblemPanel weekId={weekId(week.week)} division="B" problem={week.divisionB} />
                </TabsContent>
              </Tabs>
            </>
          )}
        </section>
      </main>
    </div>
  );
};

export default Index;
