import Image from "next/image";

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:py-12 space-y-8">
      <section className="overflow-hidden rounded-[2rem] border border-border/50 bg-[linear-gradient(150deg,rgba(255,255,255,0.82),rgba(248,238,221,0.92))] shadow-[0_30px_80px_rgba(0,0,0,0.08)]">
        <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-14">
            <p className="ui-eyebrow mb-3">Begin Your Journey</p>
            <h1 className="ui-section-title max-w-xl">Contact</h1>
            <p className="ui-prose mt-4 max-w-xl text-base sm:text-lg">
              Tell us what you want to book in Marrakech and we will get back to you quickly.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                { label: "Fast reply", value: "Within 24h" },
                { label: "Local team", value: "Marrakech based" },
                { label: "Support", value: "7 days a week" },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/60 bg-white/70 p-4 backdrop-blur-sm">
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-zinc-500">{item.label}</p>
                  <p className="mt-1 text-sm font-semibold text-zinc-900">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-80 lg:min-h-full">
            <Image
              src="https://images.pexels.com/photos/16188292/pexels-photo-16188292.jpeg"
              alt="Marrakech skyline at sunset"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/15 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 text-white">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/80">Marrakech Vibes</p>
              <p className="mt-2 max-w-md text-sm text-white/85">
                Rich textures, warm light and the spirit of the red city set the tone for your next experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-2 md:gap-8">
        <form className="ui-surface space-y-3 p-5 sm:p-6">
          <p className="ui-eyebrow mb-2">Send a message</p>
          <input className="w-full rounded-xl border border-border bg-white/90 p-3" placeholder="Full name" />
          <input className="w-full rounded-xl border border-border bg-white/90 p-3" placeholder="Email" />
          <input className="w-full rounded-xl border border-border bg-white/90 p-3" placeholder="Phone" />
          <textarea className="min-h-32 w-full rounded-xl border border-border bg-white/90 p-3" placeholder="Message" />
          <button className="rounded-full bg-primary px-6 py-3 text-primary-foreground transition-all hover:brightness-110">
            Send
          </button>
        </form>
        <div className="ui-surface-soft space-y-4 p-5 sm:p-6">
          <p className="ui-heading text-lg font-semibold">UpToMarrakech</p>
          <p className="text-zinc-700">Email: contact@uptomarrakech.com</p>
          <p className="text-zinc-700">Phone: +212 6 99-12 47 35</p>
          <p className="text-zinc-700">Address: Marrakech, Morocco</p>

          <div className="relative mt-5 overflow-hidden rounded-2xl border border-border/50">
            <Image
              src="https://images.unsplash.com/photo-1597211684565-dca64d8108fd?auto=format&fit=crop&w=1200&q=80"
              alt="Marrakech city scene"
              width={1200}
              height={800}
              className="h-56 w-full object-cover"
            />
          </div>
        </div>
      </div>
    </main>
  );
}

