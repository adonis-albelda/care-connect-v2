import Image from 'next/image'
import Reveal from '@/components/Reveal'
import { HexagonPattern } from '@/components/ui/hexagon-pattern'

const PILLARS = [
  {
    icon: '/images/icons/trust.svg',
    title: 'Caregivers You Can Trust',
    body: 'Feel better in the comfort of your own home. We specialize in care and daily living assistance for an array of individuals. Whether you need daily or weekly assistance due to aging, illness, recovery, or rehabilitation, our caregivers provide individualized service you can trust.',
  },
  {
    icon: '/images/icons/supportive.svg',
    title: 'Experienced and Supportive',
    body: 'We understand that not one care plan fits all. Daily services can include anything from meal preparation, hygiene, cleaning, and supervision. We take the time to get to know you and develop an individualized care plan that fits your specific needs.',
  },
  {
    icon: '/images/icons/health.svg',
    title: 'Experienced Home Health Aids',
    body: 'Companionship is key to a trusted relationship with our caregivers. We not only strive to help you with everyday tasks but want to develop a caring relationship with you. We provide one-on-one attention and care that cannot compare in other settings.',
  },
]

export default function TrustSection() {
  return (
    <section className="relative overflow-hidden bg-white px-4 py-12 sm:px-6 sm:py-20">
      <HexagonPattern radius={48} gap={6} className="fill-connect-blue/[0.04] stroke-connect-blue/[0.08]" />
      <div className="relative mx-auto max-w-content">
        <Reveal
          as="div"
          className="relative aspect-[1728/600] w-full overflow-hidden rounded-2xl shadow-card transition-shadow duration-250 hover:shadow-card-hover"
        >
          <Image
            src="/images/who-img.webp"
            alt="A Care Connect caregiver spending time with a client in their home"
            fill
            sizes="(min-width: 1280px) 1232px, 100vw"
            className="object-cover"
          />
        </Reveal>

        <Reveal as="div" className="mt-12 max-w-[70ch]">
          <h2 className="font-headline text-h1 text-connect-blue">Who we are</h2>
          <p className="mt-3 text-body-lg text-slate">
            Three simple reasons families trust us with the people they love most.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {PILLARS.map((pillar, i) => (
            <Reveal
              key={pillar.title}
              delay={i * 100}
              className="flex flex-col items-center rounded-2xl border border-border bg-white p-8 text-center shadow-card transition-all duration-250 hover:-translate-y-1 hover:shadow-card-hover"
            >
              <span className="flex h-16 w-16 flex-none items-center justify-center rounded-2xl bg-blue-light">
                <Image src={pillar.icon} alt="" width={36} height={36} aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-headline text-h3 text-ink">{pillar.title}</h3>
              <p className="mt-2 text-body text-slate">{pillar.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
