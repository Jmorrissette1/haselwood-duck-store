import Link from "next/link";
import DrivingGame from "./DrivingGame";

export default function PlayPage() {
  return (
    <main className="min-h-screen bg-stone-950 text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-5">
          <Link
            href="/"
            className="text-sm font-bold text-yellow-300 hover:underline"
          >
            ← Back to the Duck Store
          </Link>

          <span className="text-sm font-bold text-stone-400">
            WEST HILLS WADE
          </span>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <p className="text-sm font-bold uppercase tracking-widest text-yellow-300">
          A little duck. A wild ride.
        </p>

        <h1 className="mt-3 text-4xl font-black sm:text-6xl">
          Wade’s Wild Ride
        </h1>

        <p className="mt-4 max-w-2xl leading-relaxed text-stone-300">
          Take Wade off the beaten path. Explore the dirt trail, navigate the
          rocks, and find your own adventure.
        </p>

        <DrivingGame />
      </section>
    </main>
  );
}
