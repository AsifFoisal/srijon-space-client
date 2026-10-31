import type { Metadata } from "next";
import Link from "next/link";
import { SUPPORT_EMAIL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Help, Terms & Privacy",
  description:
    "StudioSpace help centre, terms and conditions, and privacy information for this demo marketplace.",
};

const faqs = [
  {
    question: "How do bookings work?",
    answer:
      "Choose a studio, select your date and hours, and send a booking request. Your booking starts as Pending. Once a host confirms, it becomes Confirmed and appears in My Bookings. After your session, the host marks it Completed.",
  },
  {
    question: "When is the security deposit charged?",
    answer:
      "The deposit is shown separately from the hourly rental fee in every booking summary. In this demo no payment is taken; the deposit is displayed to demonstrate transparent pricing.",
  },
  {
    question: "Can I cancel a booking?",
    answer:
      "Pending bookings can be cancelled from My Bookings. Open the booking and choose Cancel Booking, then confirm. The status changes to Cancelled and the cancellation is recorded immediately.",
  },
  {
    question: "How do I contact a host?",
    answer:
      "Every studio detail page includes a host profile with a Contact Host button. Messages are simulated in this demo, but the flow is ready for a real messaging integration.",
  },
  {
    question: "How do I list my own studio?",
    answer:
      "Sign in, open Add New Studio from the dashboard, complete the form, and submit. Your listing appears immediately in Explore Studios and My Studio Listings.",
  },
];

export default function PoliciesPage() {
  return (
    <div className="pb-20 pt-28 sm:pt-32">
      <div className="shell shell-wide">
        <p className="kicker">Support &amp; policies</p>
        <h1 className="mt-3 max-w-3xl text-balance font-display text-[clamp(2.6rem,5vw,4.4rem)] leading-[0.98] tracking-[-0.05em]">
          Help, Terms &amp; Privacy.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-stone">
          Everything you need to know about how StudioSpace works. This is a
          frontend demonstration project, so bookings, accounts, and payments
          are simulated and stored locally in your browser.
        </p>

        <div className="mt-12 grid gap-12 lg:grid-cols-[220px_1fr]">
          <nav className="lg:sticky lg:top-28 lg:self-start" aria-label="Policy sections">
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#help"
                  className="text-stone transition-colors hover:text-ink"
                >
                  Help centre
                </a>
              </li>
              <li>
                <a
                  href="#terms"
                  className="text-stone transition-colors hover:text-ink"
                >
                  Terms &amp; conditions
                </a>
              </li>
              <li>
                <a
                  href="#privacy"
                  className="text-stone transition-colors hover:text-ink"
                >
                  Privacy policy
                </a>
              </li>
            </ul>
            <p className="mt-6 border-t border-line pt-4 text-xs leading-5 text-stone">
              Still need help?{" "}
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="font-medium text-accent-deep hover:text-accent"
              >
                Email support
              </a>
            </p>
          </nav>

          <div className="max-w-3xl space-y-16">
            <section id="help" className="scroll-mt-28">
              <h2 className="font-display text-3xl tracking-[-0.03em]">
                Help centre
              </h2>
              <p className="mt-3 text-sm leading-7 text-stone">
                Quick answers to the questions creators and hosts ask most.
              </p>
              <div className="mt-6 divide-y divide-line/70 border-y border-line/70">
                {faqs.map((faq) => (
                  <details key={faq.question} className="group py-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-ink marker:hidden">
                      {faq.question}
                      <span className="text-stone transition-transform group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="mt-3 text-sm leading-7 text-stone">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </section>

            <section id="terms" className="scroll-mt-28">
              <h2 className="font-display text-3xl tracking-[-0.03em]">
                Terms &amp; conditions
              </h2>
              <div className="mt-4 space-y-4 text-sm leading-7 text-stone">
                <p>
                  StudioSpace is a demonstration marketplace. All listings,
                  hosts, bookings, reviews, and payments shown in this project
                  are fictional unless explicitly stated. Nothing on this site
                  constitutes a real rental agreement.
                </p>
                <p>
                  Bookings submitted through the interface create mock records
                  in your browser&apos;s local storage. No payment is processed,
                  no reservation is transmitted to a host, and no legal
                  obligation is created.
                </p>
                <p>
                  Hosts are responsible for the accuracy of their listings,
                  including capacity, pricing, amenities, and availability.
                  Creators are responsible for using spaces and equipment
                  safely and respectfully. In a production environment, these
                  responsibilities would be governed by a formal rental
                  agreement.
                </p>
                <p>
                  We may update these terms as the platform evolves. Continued
                  use of the demo constitutes acceptance of the current version.
                </p>
              </div>
            </section>

            <section id="privacy" className="scroll-mt-28">
              <h2 className="font-display text-3xl tracking-[-0.03em]">
                Privacy policy
              </h2>
              <div className="mt-4 space-y-4 text-sm leading-7 text-stone">
                <p>
                  This demo stores your mock account details, listings,
                  bookings, favorites, and newsletter subscription in your
                  browser&apos;s local storage. That data never leaves your
                  device and is not sent to a server.
                </p>
                <p>
                  You can clear everything by removing the site&apos;s local
                  storage from your browser settings. Doing so resets the demo
                  to its seeded state, including the sample listings and
                  bookings.
                </p>
                <p>
                  We do not collect analytics, payment details, or precise
                  location data in this project. If StudioSpace were deployed
                  as a production service, a full privacy notice covering data
                  processing, retention, and your rights would apply.
                </p>
              </div>
            </section>

            <section className="rounded-2xl border border-line bg-paper p-6">
              <p className="kicker">Contact</p>
              <h2 className="mt-3 font-display text-2xl tracking-[-0.02em]">
                Talk to a real person.
              </h2>
              <p className="mt-2 text-sm leading-6 text-stone">
                Questions about the marketplace, hosting, or partnerships? Our
                team reads every message.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="inline-flex h-11 items-center rounded-full bg-accent px-5 text-sm font-medium text-white transition-colors hover:bg-accent-deep"
                >
                  Email {SUPPORT_EMAIL}
                </a>
                <Link
                  href="/about"
                  className="inline-flex h-11 items-center rounded-full border border-line px-5 text-sm font-medium text-ink transition-colors hover:border-ink/30"
                >
                  About StudioSpace
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
