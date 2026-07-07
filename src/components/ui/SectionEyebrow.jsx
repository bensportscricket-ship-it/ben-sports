export default function SectionEyebrow({ children }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-bail">
      <span className="h-1.5 w-1.5 rounded-full bg-bail" />
      {children}
    </span>
  )
}
