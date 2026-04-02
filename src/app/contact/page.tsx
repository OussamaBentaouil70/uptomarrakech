export default function ContactPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:py-12">
      <section className="ui-shell ui-shell-ornament mb-8 bg-[linear-gradient(150deg,rgba(255,255,255,0.74),rgba(248,238,221,0.84))]">
        <p className="ui-eyebrow mb-2">Begin Your Journey</p>
        <h1 className="ui-section-title">Contact</h1>
        <p className="ui-prose mt-2">
          Tell us what you want to book in Marrakech and we will get back to you quickly.
        </p>
      </section>
      <div className="grid gap-6 md:grid-cols-2 md:gap-8">
        <form className="ui-surface space-y-3 p-5 sm:p-6">
          <input className="w-full rounded-xl border border-border bg-white/90 p-3" placeholder="Full name" />
          <input className="w-full rounded-xl border border-border bg-white/90 p-3" placeholder="Email" />
          <input className="w-full rounded-xl border border-border bg-white/90 p-3" placeholder="Phone" />
          <textarea className="min-h-32 w-full rounded-xl border border-border bg-white/90 p-3" placeholder="Message" />
          <button className="rounded-full bg-primary px-6 py-3 text-primary-foreground transition-all hover:brightness-110">
            Send
          </button>
        </form>
        <div className="ui-surface-soft space-y-3 p-5 sm:p-6">
          <p className="ui-heading text-lg font-semibold">UpToMarrakech</p>
          <p className="text-zinc-700">Email: contact@uptomarrakech.com</p>
          <p className="text-zinc-700">Phone: +212 6 99-12 47 35</p>
          <p className="text-zinc-700">Address: Marrakech, Morocco</p>
        </div>
      </div>
    </main>
  );
}

