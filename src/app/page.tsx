import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Wade the Duck | Duck Store",
	description: "Meet Wade. Grab a duck and make someone's day.",
};

export default function Home() {
	return (
		<div className="min-h-screen bg-[#f7f5ef] text-[#20221e]">
			<header className="border-b border-black/10">
				<div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-5">
					<a
						href="/"
						aria-label="Wade the Duck home"
						className="text-xl font-black tracking-tight"
					>
						WADE<span className="text-[#8a6500]">.</span>
					</a>

					<a
						href="#how-it-works"
						className="text-sm font-semibold underline-offset-4 hover:underline"
					>
						How it works
					</a>
				</div>
			</header>

			<main>
				<section
					aria-labelledby="product-heading"
					className="mx-auto grid max-w-6xl gap-10 px-6 py-12 md:grid-cols-2 md:items-center md:gap-16 md:py-20"
				>
					<figure className="relative flex aspect-square flex-col items-center justify-center overflow-hidden rounded-3xl bg-[#f5cf49] p-8">
						<span className="absolute left-6 top-6 rounded-full bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-widest">
							Meet your next copilot
						</span>

						<span aria-hidden="true" className="text-[140px] sm:text-[180px]">
							🦆
						</span>

						<figcaption className="absolute bottom-6 rounded-full bg-[#20221e] px-4 py-2 text-xs font-medium text-white">
							Placeholder — product photo coming soon
						</figcaption>
					</figure>

					<div>
						<p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#666950]">
							A little duck. A little kindness.
						</p>

						<h1
							id="product-heading"
							className="text-6xl font-black leading-none tracking-tight sm:text-7xl"
						>
							Meet Wade.
						</h1>

						<p className="mt-6 text-2xl font-semibold tracking-tight">
							Grab a duck. Make someone&apos;s day.
						</p>

						<p className="mt-4 max-w-md leading-7 text-[#62645b]">
							Keep Wade along for the ride or pass a little happiness to someone
							else. Your next ducking adventure starts here.
						</p>

						<div className="my-8 border-y border-black/10 py-5">
							<p className="text-xl font-bold">Coming soon</p>
							<p className="mt-1 text-sm text-[#62645b]">
								Product details and pricing are being finalized.
							</p>
						</div>

						<h2 className="text-base font-bold">
							How would you like your duck?
						</h2>

						<div className="mt-4 grid gap-3 sm:grid-cols-2">
							<div className="rounded-2xl border border-black/15 bg-white p-5">
								<h3 className="font-bold">Ship to me</h3>
								<p className="mt-2 text-sm leading-6 text-[#62645b]">
									Shipping options will be listed here before launch.
								</p>
								<button
									type="button"
									disabled
									aria-describedby="checkout-status"
									className="mt-5 w-full cursor-not-allowed rounded-xl bg-[#ecece6] px-4 py-3 text-sm font-semibold text-[#62645b]"
								>
									Shipping coming soon
								</button>
							</div>

							<div className="rounded-2xl border border-black/15 bg-white p-5">
								<h3 className="font-bold">Pick up locally</h3>
								<p className="mt-2 text-sm leading-6 text-[#62645b]">
									Pickup locations and instructions are coming soon.
								</p>
								<button
									type="button"
									disabled
									aria-describedby="checkout-status"
									className="mt-5 w-full cursor-not-allowed rounded-xl bg-[#ecece6] px-4 py-3 text-sm font-semibold text-[#62645b]"
								>
									Pickup coming soon
								</button>
							</div>
						</div>

						<p
							id="checkout-status"
							className="mt-4 text-sm leading-6 text-[#62645b]"
						>
							Online ordering is not open yet. Payments will be handled through
							Stripe when the store launches.
						</p>
					</div>
				</section>

				<section
					id="how-it-works"
					aria-labelledby="how-heading"
					className="scroll-mt-8 bg-[#20221e] text-[#f7f5ef]"
				>
					<div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
						<p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f5cf49]">
							Small duck. Big smile.
						</p>
						<h2
							id="how-heading"
							className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl"
						>
							A little kindness goes a long way.
						</h2>

						<ol className="mt-10 grid gap-8 md:grid-cols-3">
							{[
								{
									title: "Pick your delivery",
									text: "Choose shipping or local pickup when ordering opens.",
								},
								{
									title: "Check out with Stripe",
									text: "Follow your chosen option to Stripe to complete your purchase.",
								},
								{
									title: "Make someone smile",
									text: "Keep Wade as your copilot or pass the ducking fun along.",
								},
							].map((step, index) => (
								<li key={step.title} className="border-t border-white/20 pt-5">
									<span className="text-sm font-bold text-[#f5cf49]">
										0{index + 1}
									</span>
									<h3 className="mt-3 text-lg font-bold">{step.title}</h3>
									<p className="mt-2 max-w-xs text-sm leading-6 text-[#c3c5ba]">
										{step.text}
									</p>
								</li>
							))}
						</ol>
					</div>
				</section>
			</main>

			<footer className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-7 text-sm text-[#62645b] sm:flex-row sm:items-center sm:justify-between">
				<p className="font-bold text-[#20221e]">Wade the Duck</p>
				<p>Store preview · Online ordering coming soon</p>
			</footer>
		</div>
	);
}
