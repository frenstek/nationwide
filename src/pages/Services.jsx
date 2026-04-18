import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ScrollReveal from '../components/ScrollReveal'

const services = [
  {
    id: 'architecture',
    title: 'Architecture',
    tagline: 'Design That Inspires',
    hero: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200&h=800&fit=crop',
    description: 'Our architecture studio combines creative vision with technical expertise to design spaces that are both beautiful and functional. From concept sketches to detailed construction documents, we bring your architectural vision to life.',
    features: [
      'Concept Design & Master Planning',
      'Schematic & Detailed Design',
      '3D Visualization & Rendering',
      'Sustainable Design Integration',
      'Interior Architecture',
      'Urban Planning & Landscape',
    ],
    stat: { value: '80+', label: 'Designs Delivered' },
  },
  {
    id: 'residential',
    title: 'Residential',
    tagline: 'Homes Built to Last',
    hero: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop',
    description: 'We build premium residential spaces — from luxury single-family homes to multi-unit developments. Every home we construct reflects exceptional craftsmanship, modern design principles, and a deep respect for how people live.',
    features: [
      'Custom Home Construction',
      'Multi-Unit Developments',
      'Luxury Renovations',
      'Smart Home Integration',
      'Energy-Efficient Building',
      'Landscape & Outdoor Living',
    ],
    stat: { value: '120+', label: 'Homes Built' },
  },
  {
    id: 'commercial',
    title: 'Commercial',
    tagline: 'Spaces That Perform',
    hero: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&h=800&fit=crop',
    description: 'Our commercial construction division delivers high-performance workspaces, retail centers, hospitality venues, and mixed-use developments. We understand that commercial spaces must drive business outcomes while providing exceptional user experiences.',
    features: [
      'Office Buildings & Towers',
      'Retail & Shopping Centers',
      'Hospitality & Hotels',
      'Mixed-Use Developments',
      'Fit-Out & Refurbishment',
      'Industrial & Warehouse',
    ],
    stat: { value: '60+', label: 'Commercial Projects' },
  },
  {
    id: 'infrastructure',
    title: 'Infrastructure',
    tagline: 'Connecting Communities',
    hero: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&h=800&fit=crop',
    description: 'We deliver the critical infrastructure that keeps communities moving. From roads and bridges to utilities and civil works, our infrastructure division handles large-scale projects with precision, safety, and engineering excellence.',
    features: [
      'Roads & Highways',
      'Bridges & Overpasses',
      'Water & Drainage Systems',
      'Utilities & Power',
      'Civil Engineering',
      'Environmental & Earthworks',
    ],
    stat: { value: '40+', label: 'Infrastructure Projects' },
  },
]

const process = [
  { step: '01', title: 'Consultation', desc: 'We begin with a thorough understanding of your vision, requirements, budget, and timeline.' },
  { step: '02', title: 'Design & Planning', desc: 'Our team develops comprehensive designs, engineering plans, and project strategies.' },
  { step: '03', title: 'Construction', desc: 'Expert teams execute the build with rigorous quality control and safety standards.' },
  { step: '04', title: 'Delivery', desc: 'We hand over a completed project that meets or exceeds every specification and expectation.' },
]

export default function Services() {
  const [activeService, setActiveService] = useState(services[0].id)
  const active = services.find((s) => s.id === activeService)

  return (
    <div className="bg-void">
      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="relative min-h-[60vh] md:min-h-[70vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1920&h=1080&fit=crop"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-void via-void/70 to-void/30" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 pb-16 pt-28 md:pb-20 md:pt-40">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-px bg-amber" />
            <span className="text-amber text-xs font-semibold tracking-[0.3em] uppercase">Our Services</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-white leading-[0.95] mb-6">
            Comprehensive<br /><span className="text-amber">Construction Solutions</span>
          </h1>
          <p className="text-white/50 text-lg max-w-2xl">
            From initial concept to final handover, we provide end-to-end services
            across architecture, residential, commercial, and infrastructure sectors.
          </p>
        </div>
      </section>

      {/* ═══════════════════ SERVICE TABS ═══════════════════ */}
      <section className="py-28 lg:py-36">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Tab nav */}
          <ScrollReveal>
            <div className="flex flex-wrap gap-2 mb-16 border-b border-white/5 pb-6">
              {services.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveService(s.id)}
                  className={`px-6 py-3 text-sm font-semibold tracking-wider uppercase transition-all duration-300 ${
                    activeService === s.id
                      ? 'bg-amber text-white'
                      : 'text-white/40 hover:text-white border border-white/10 hover:border-white/20'
                  }`}
                >
                  {s.title}
                </button>
              ))}
            </div>
          </ScrollReveal>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="grid lg:grid-cols-2 gap-12 items-start">
                {/* Image */}
                <div className="relative overflow-hidden aspect-[4/3]">
                  <img
                    src={active.hero}
                    alt={active.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 bg-amber p-6">
                    <span className="font-display text-3xl text-white block">{active.stat.value}</span>
                    <span className="text-white/80 text-xs tracking-wider uppercase">{active.stat.label}</span>
                  </div>
                </div>

                {/* Details */}
                <div>
                  <span className="text-amber text-xs font-semibold tracking-[0.3em] uppercase block mb-3">
                    {active.tagline}
                  </span>
                  <h2 className="font-display text-4xl text-white mb-6">{active.title}</h2>
                  <p className="text-white/50 leading-relaxed mb-10">{active.description}</p>

                  <h3 className="text-white text-sm font-semibold tracking-wider uppercase mb-6">
                    What We Offer
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4 mb-10">
                    {active.features.map((f) => (
                      <div key={f} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 bg-amber rounded-full mt-2 shrink-0" />
                        <span className="text-white/60 text-sm">{f}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    to="/contact"
                    className="inline-block px-8 py-3.5 bg-amber text-white font-semibold tracking-wider uppercase text-sm hover:bg-amber-light transition-all duration-300"
                  >
                    Discuss Your Project
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ═══════════════════ PROCESS ═══════════════════ */}
      <section className="py-28 lg:py-36 bg-void-light border-y border-white/5">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-20">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-12 h-px bg-amber" />
                <span className="text-amber text-xs font-semibold tracking-[0.3em] uppercase">How We Work</span>
                <div className="w-12 h-px bg-amber" />
              </div>
              <h2 className="font-display text-4xl md:text-5xl text-white">Our Process</h2>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {process.map((p, i) => (
              <ScrollReveal key={p.step} delay={i * 0.1}>
                <div className="p-8 border border-white/5 bg-void h-full group hover:border-amber/20 transition-all duration-500 relative">
                  <span className="font-display text-6xl text-amber/10 block mb-4 group-hover:text-amber/20 transition-colors">
                    {p.step}
                  </span>
                  <h3 className="text-white text-lg font-semibold mb-3">{p.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{p.desc}</p>
                  {i < process.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-white/10" />
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="py-28 lg:py-36">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <ScrollReveal>
            <h2 className="font-display text-4xl md:text-5xl text-white mb-6">
              Ready to Start Your <span className="text-amber">Project</span>?
            </h2>
            <p className="text-white/50 text-lg mb-10 max-w-2xl mx-auto">
              Whether you need architectural design, residential construction, commercial
              development, or infrastructure solutions — our team is ready to deliver.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/contact"
                className="px-10 py-4 bg-amber text-white font-semibold tracking-wider uppercase text-sm hover:bg-amber-light transition-all duration-300"
              >
                Get a Free Quote
              </Link>
              <Link
                to="/projects"
                className="px-10 py-4 border border-white/20 text-white font-semibold tracking-wider uppercase text-sm hover:bg-white/5 transition-all duration-300"
              >
                See Our Work
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
