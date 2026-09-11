import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f6fbf7] text-gray-900">
      {/* Navbar */}
      <nav className="flex items-center justify-between border-b border-green-100 bg-white px-8 py-5">
        <Link
          href="/"
          className="text-2xl font-bold text-green-700"
        >
          LaunchIQ
        </Link>

        <div className="hidden gap-8 text-sm text-gray-600 md:flex">
          <a
            href="#features"
            className="transition hover:text-green-700"
          >
            Features
          </a>

          <a
            href="#how"
            className="transition hover:text-green-700"
          >
            How it works
          </a>

          <a
            href="#about"
            className="transition hover:text-green-700"
          >
            About
          </a>
        </div>

        <Link
          href="/analyze"
          className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
        >
          Start Analysis
        </Link>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-8 py-24 text-center">
        <div className="mb-6 inline-block rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
          AI-Powered Venture Intelligence
        </div>

        <h1 className="mx-auto max-w-4xl text-5xl font-bold tracking-tight md:text-6xl">
          Turn a Business Idea Into a
          <span className="text-green-600">
            {" "}
            Data-Driven Venture
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
          LaunchIQ analyzes markets, competition, economics,
          regulation, labour costs and risks to help you
          understand whether your startup idea can actually
          work.
        </p>

        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/analyze"
            className="rounded-xl bg-green-600 px-7 py-4 font-semibold text-white shadow-lg transition hover:bg-green-700"
          >
            Analyze My Idea →
          </Link>

          <Link
            href="/results"
            className="rounded-xl border border-gray-300 bg-white px-7 py-4 font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Explore Dashboard
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto grid max-w-5xl grid-cols-1 gap-4 px-8 pb-20 md:grid-cols-4">
        {[
          ["Market Size", "TAM / SAM / SOM"],
          ["Competition", "Competitor Analysis"],
          ["Economics", "Revenue & Costs"],
          ["Risk", "AI Risk Engine"],
        ].map(([title, text]) => (
          <div
            key={title}
            className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <h3 className="text-lg font-bold text-gray-900">
              {title}
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              {text}
            </p>
          </div>
        ))}
      </section>

      {/* Features */}
      <section
        id="features"
        className="bg-white px-8 py-20"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-12">
            <p className="font-semibold text-green-600">
              WHAT LAUNCHIQ ANALYZES
            </p>

            <h2 className="mt-2 text-4xl font-bold">
              Everything you need to evaluate a venture
            </h2>

            <p className="mt-4 max-w-2xl leading-7 text-gray-600">
              LaunchIQ brings multiple dimensions of venture
              analysis together in one structured intelligence
              report.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Market Intelligence",
                text: "Analyze GDP, population, market size, demand and growth.",
              },
              {
                title: "Competition",
                text: "Identify competitors, market leaders and competitive gaps.",
              },
              {
                title: "Economics",
                text: "Estimate labour costs, operating costs, revenue and margins.",
              },
              {
                title: "Regulation",
                text: "Understand regulatory requirements and barriers.",
              },
              {
                title: "Risk Engine",
                text: "Evaluate financial, market, operational and regulatory risks.",
              },
              {
                title: "Venture Score",
                text: "Convert the analysis into an easy-to-understand venture score.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-gray-200 p-7 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-xl">
                  ✦
                </div>

                <h3 className="text-xl font-bold">
                  {feature.title}
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how"
        className="bg-[#f6fbf7] px-8 py-20"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="font-semibold text-green-600">
              HOW IT WORKS
            </p>

            <h2 className="mt-2 text-4xl font-bold">
              From idea to intelligence
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-600">
              LaunchIQ turns a simple business idea into a
              structured venture assessment.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                number: "01",
                title: "Describe your idea",
                text: "Tell LaunchIQ what you want to build, where you want to launch it and who you want to serve.",
              },
              {
                number: "02",
                title: "LaunchIQ analyzes it",
                text: "The platform evaluates market opportunity, competition, economics and risk.",
              },
              {
                number: "03",
                title: "Get your report",
                text: "Review your Venture Score and detailed intelligence before making your next decision.",
              },
            ].map((step) => (
              <div
                key={step.number}
                className="rounded-2xl border border-green-100 bg-white p-7 shadow-sm"
              >
                <div className="text-4xl font-black text-green-100">
                  {step.number}
                </div>

                <h3 className="mt-4 text-xl font-bold">
                  {step.title}
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section
        id="about"
        className="bg-white px-8 py-20"
      >
        <div className="mx-auto max-w-5xl">
          <div className="rounded-3xl border border-green-100 bg-[#f6fbf7] p-8 md:p-12">
            <p className="font-semibold text-green-600">
              ABOUT LAUNCHIQ
            </p>

            <h2 className="mt-3 text-4xl font-bold">
              Make better venture decisions before you build.
            </h2>

            <p className="mt-5 max-w-3xl leading-8 text-gray-600">
              LaunchIQ is designed to help founders move
              beyond intuition by combining market,
              competitive, financial and risk intelligence
              into one practical venture assessment.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 py-24">
        <div className="mx-auto max-w-5xl rounded-3xl bg-green-700 px-8 py-16 text-center text-white">
          <h2 className="text-4xl font-bold">
            Have a startup idea?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-green-100">
            Let LaunchIQ turn your idea into a structured
            venture intelligence report.
          </p>

          <Link
            href="/analyze"
            className="mt-8 inline-block rounded-xl bg-white px-7 py-4 font-semibold text-green-700 transition hover:bg-green-50"
          >
            Start Your Analysis →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-green-100 bg-white px-8 py-8 text-center text-sm text-gray-500">
        © 2026 LaunchIQ — AI Venture Intelligence Engine
      </footer>
    </main>
  );
}
