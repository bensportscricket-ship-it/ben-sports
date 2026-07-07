import SectionEyebrow from '../components/ui/SectionEyebrow'

export default function Placeholder({ title, description }) {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-start justify-center px-6 py-20">
      <SectionEyebrow>Coming Soon</SectionEyebrow>
      <h1 className="mt-4 text-3xl font-semibold text-ink sm:text-4xl">{title}</h1>
      <p className="mt-4 text-ink-muted">{description}</p>
    </section>
  )
}
