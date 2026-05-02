export default function SiteFooter() {
  return (
    <footer
      className="mt-auto border-t border-slate-400/25"
      style={{ background: "radial-gradient(circle at bottom, #020617 0, #000 70%)" }}
    >
      <div className="container py-8 flex flex-col md:flex-row justify-between items-center gap-2 text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} STEMist Education</p>
        <p>New problems every Sunday.</p>
      </div>
    </footer>
  )
}
