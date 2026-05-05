import Image from "next/image";
import Link from "next/link";

export default function ThankYouPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
      <section className="ui-shell ui-shell-ornament overflow-hidden rounded-[2rem] border border-border/60 bg-[linear-gradient(150deg,rgba(255,255,255,0.9),rgba(248,238,221,0.88))] shadow-[0_30px_80px_rgba(0,0,0,0.08)]">
        <div className="grid items-stretch gap-0 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-14">
            <Image
              src="https://i.postimg.cc/L8kqSsCc/logo-mymarrakechtrip.webp"
              alt="MyMarrakechTrip logo"
              width={220}
              height={72}
              className="h-auto w-44 sm:w-52"
              priority
            />

            <p className="ui-eyebrow mt-8">Message received</p>
            <h1 className="ui-section-title mt-3 max-w-xl">Thank you for your request</h1>
            <p className="ui-prose mt-4 max-w-xl text-base sm:text-lg">
              We have received your form and our team will contact you as soon as possible.
            </p>

            <div className="mt-8">
              <Link href="/" className="btn-luxe">
                Return to home page
              </Link>
            </div>
          </div>

          <div className="relative min-h-80 lg:min-h-full">
            <Image
              src="https://images.pexels.com/photos/30682505/pexels-photo-30682505.jpeg"
              alt="Marrakech city scene"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/20 to-transparent" />
          </div>
        </div>
      </section>
    </main>
  );
}
