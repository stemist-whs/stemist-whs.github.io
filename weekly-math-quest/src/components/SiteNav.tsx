import { Link, NavLink } from "react-router-dom"
import logo from "@/assets/logo.png"

export default function SiteNav() {
  const linkBase =
    "font-heading text-sm font-semibold uppercase tracking-widest px-5 py-2 rounded-full border transition-all duration-300 backdrop-blur-sm"
  const active =
    "text-foreground border-sky-400/70 bg-gradient-to-br from-sky-400/25 to-green-400/15 shadow-[0_4px_16px_rgba(56,189,248,0.3)]"
  const idle =
    "text-foreground/70 border-slate-400/30 bg-secondary/60 hover:text-foreground hover:border-sky-400/60 hover:bg-gradient-to-br hover:from-sky-400/15 hover:to-green-400/10 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(56,189,248,0.2)]"

  return (
    <header className="sticky top-0 z-40 backdrop-blur-lg border-b border-slate-400/25"
      style={{ background: "linear-gradient(to bottom, rgba(2,6,23,0.96), rgba(2,6,23,0.75), transparent)" }}>
      <div className="container flex items-center justify-between h-[4.5rem]">
        <Link
          to="/"
          className="font-heading font-bold text-xl uppercase tracking-widest px-5 py-2 rounded-full border border-slate-400/30 transition-all duration-300 hover:-translate-y-0.5 hover:drop-shadow-[0_4px_12px_rgba(56,189,248,0.4)]"
          style={{
            background: "linear-gradient(135deg, #38bdf8, #22c55e)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          STEMist Mathathon
        </Link>
        <nav className="flex items-center gap-3">
          <NavLink to="/" end className={({ isActive }) => `${linkBase} ${isActive ? active : idle}`}>
            Problem of the Week
          </NavLink>
          <NavLink to="/archive" className={({ isActive }) => `${linkBase} ${isActive ? active : idle}`}>
            Archive
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
