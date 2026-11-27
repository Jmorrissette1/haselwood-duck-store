import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-stone-50 text-stone-900">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-5">
          <Link
            href="/"
            aria-label="Duck Store home"
            className="relative block h-16 w-48 shrink-0 sm:h-20 sm:w-64"
          >
            <Image
              src="/images/duck-logo-horizontal.png"
              alt="Wade’s Duck Store"
              fill
              sizes="(min-width: 640px) 256px, 192px"
              className="object-contain object-left"
            />
          </Link>

          <nav
            aria-label="Main navigation"
            className="flex gap-6 text-sm font-semibold"
          >
            <a href="#shop" className="hover:underline">
              Shop
            </a>
            <Link href="/play" className="hover:underline">
              Wade’s Wild Ride
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-2 md:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-stone-600">
            Meet your next copilot
          </p>

          <h1 className="mt-4 text-5xl font-black leading-tight md:text-7xl">
            Small duck.
            <br />
            Big adventure.
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-stone-600">
            A little personality for your next adventure. Meet Wade, your new
            copilot, and join him for a wild ride.
          </p>
        </div>

        <div className="relative isolate flex aspect-square items-center justify-center overflow-hidden rounded-3xl bg-yellow-300 p-10">
          {/* Decorative background */}
          <Image
            src="/images/duck-background.png"
            alt=""
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="-z-10 object-cover"
          />

          {/* Keep the logo readable over the artwork */}
          <div className="relative aspect-square w-full max-w-80 rounded-3xl bg-white/95 p-6 shadow-xl">
            <div className="relative h-full w-full">
              <Image
                src="/images/duck-logo-vertical.png"
                alt="West Hills Wade"
                fill
                sizes="(min-width: 768px) 272px, 70vw"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="shop" className="scroll-mt-8 border-t border-stone-200">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <p className="text-sm font-bold uppercase tracking-widest text-stone-600">
            Bring Wade along
          </p>

          <div className="mt-6 grid gap-8 rounded-3xl border border-stone-200 bg-white p-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="text-3xl font-black">
                Your next adventure buddy.
              </h2>

              <p className="mt-4 max-w-xl leading-relaxed text-stone-600">
                Make room for Wade. A little West Hills personality for your
                dashboard, desk, or wherever the road takes you.
              </p>

              <p className="mt-3 text-sm text-stone-500">
                Product photos, pricing, and purchase details coming soon.
              </p>
            </div>

            <div className="flex flex-col items-start gap-3">
              <button
                type="button"
                disabled
                className="cursor-not-allowed rounded-full bg-stone-200 px-8 py-4 font-bold text-stone-600"
              >
                Purchasing coming soon
              </button>

              <p className="text-sm text-stone-500">
                Check back for availability.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section id="game" className="scroll-mt-8 bg-stone-900 text-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <p className="text-sm font-bold uppercase tracking-widest text-stone-400">
            Coming soon
          </p>

          <h2 className="mt-3 text-4xl font-black">Wade’s Wild Ride</h2>

          <p className="mt-4 max-w-xl leading-relaxed text-stone-300">
            Jump into Wade’s Jeep, explore a colorful little town, and collect
            ducks before the clock runs out.
          </p>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-6 py-8 text-sm text-stone-600">
        Wade’s Duck Store · Adventure starts with a duck.
      </footer>
    </main>
  );
}
