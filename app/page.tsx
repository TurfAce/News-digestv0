import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { BenefitsSection } from "@/components/benefits-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <>
      <Header />
      <main className="pt-16">
        <HeroSection />
        <section id="benefits">
          <BenefitsSection />
        </section>
        <section id="testimonials">
          <TestimonialsSection />
        </section>
      </main>
      <Footer />
    </>
  )
}
