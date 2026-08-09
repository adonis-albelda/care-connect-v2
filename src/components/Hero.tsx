import { DiaTextReveal } from '@/components/ui/dia-text-reveal'
import Reveal from '@/components/Reveal'

export default function Hero() {
  return (
    <section className="relative">
      <div
        className="relative flex min-h-[60vh] items-center justify-center bg-cover bg-center px-4 py-16 text-center sm:px-6 sm:py-24"
        style={{ backgroundImage: "url('/images/hero-img.webp')" }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, rgba(15,36,97,0.82) 0%, rgba(24,56,145,0.55) 100%)',
          }}
          aria-hidden="true"
        />
        <div className="relative">
          <h1 className="font-headline text-display text-white">
            <DiaTextReveal
              text="Care That Comes to You"
              textColor="#FFFFFF"
              colors={['#D6E0F5', '#E68A25', '#D6E0F5']}
              duration={1.8}
            />
          </h1>
          <Reveal
            as="p"
            delay={1800}
            className="mx-auto mt-4 max-w-[50ch] text-body-lg text-blue-light"
          >
            Let us provide you with high-quality care!
          </Reveal>
        </div>
      </div>
    </section>
  )
}
