import ScrollReveal from '../components/ScrollReveal'
import Counter from '../components/Counter'

const timeline = [
  { year: '2010', title: 'Company Founded', desc: 'Nationwide Projects Investments established with a vision to redefine construction excellence.' },
  { year: '2013', title: 'First Major Project', desc: 'Completed our first commercial complex, establishing our reputation for quality delivery.' },
  { year: '2016', title: 'Infrastructure Division', desc: 'Expanded into infrastructure, taking on bridges, roads, and civil engineering projects.' },
  { year: '2019', title: 'Architecture Studio', desc: 'Launched our in-house architecture studio, offering end-to-end design and build solutions.' },
  { year: '2022', title: 'National Expansion', desc: 'Grew operations nationwide, building landmark projects across multiple regions.' },
  { year: '2026', title: 'Industry Leader', desc: 'Recognized as a leader in sustainable construction with 250+ completed projects.' },
]

const team = [
  { name: 'James Nakamura', role: 'CEO & Founder', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face' },
  { name: 'Sarah Mitchell', role: 'Chief Architect', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop&crop=face' },
  { name: 'Marcus Rivera', role: 'Head of Construction', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&crop=face' },
  { name: 'Emily Zhang', role: 'Director of Operations', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=500&fit=crop&crop=face' },
]

const values = [
  { title: 'Integrity', desc: 'We operate with honesty and transparency in every interaction and transaction.' },
  { title: 'Innovation', desc: 'Embracing cutting-edge technology and methods to deliver superior results.' },
  { title: 'Excellence', desc: 'Uncompromising standards in design, construction, and client service.' },
  { title: 'Sustainability', desc: 'Building responsibly to protect our environment for future generations.' },
]

export default function About() {
  return (
    <div className="bg-void">
      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="relative min-h-[60vh] md:min-h-[70vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&h=1080&fit=crop"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-void via-void/70 to-void/30" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 pb-16 pt-28 md:pb-20 md:pt-40">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-px bg-amber" />
            <span className="text-amber text-xs font-semibold tracking-[0.3em] uppercase">About Us</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-white leading-[0.95] mb-6">
            Our Story of<br /><span className="text-amber">Building Excellence</span>
          </h1>
          <p className="text-white/50 text-lg max-w-2xl">
            A legacy of transforming landscapes and shaping skylines through innovation,
            integrity, and an unwavering commitment to quality.
          </p>
        </div>
      </section>

      {/* ═══════════════════ MISSION / VISION ═══════════════════ */}
      <section className="py-28 lg:py-36 border-b border-white/5">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20">
            <ScrollReveal>
              <div>
                <span className="text-amber text-xs font-semibold tracking-[0.3em] uppercase block mb-4">Our Mission</span>
                <h2 className="font-display text-3xl md:text-4xl text-white mb-6">
                  To deliver construction and investment solutions that exceed expectations
                </h2>
                <p className="text-white/50 leading-relaxed">
                  We are dedicated to building structures that stand as testaments to quality
                  and innovation. Through strategic investment and hands-on expertise, we
                  create lasting value for our clients, communities, and stakeholders. Every
                  project we undertake reflects our commitment to transforming the built
                  environment with purpose and precision.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div>
                <span className="text-amber text-xs font-semibold tracking-[0.3em] uppercase block mb-4">Our Vision</span>
                <h2 className="font-display text-3xl md:text-4xl text-white mb-6">
                  To be the most trusted name in construction and development
                </h2>
                <p className="text-white/50 leading-relaxed">
                  We envision a future where Nationwide Projects Investments is synonymous
                  with architectural innovation, construction excellence, and sustainable
                  development. We strive to set the standard for the industry, inspiring
                  confidence in every client, partner, and community we serve.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════ VALUES ═══════════════════ */}
      <section className="py-28 lg:py-36 bg-void-light border-b border-white/5">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-12 h-px bg-amber" />
                <span className="text-amber text-xs font-semibold tracking-[0.3em] uppercase">Our Values</span>
                <div className="w-12 h-px bg-amber" />
              </div>
              <h2 className="font-display text-4xl md:text-5xl text-white">What Drives Us</h2>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <ScrollReveal key={v.title} delay={i * 0.1}>
                <div className="p-8 border border-white/5 bg-void h-full group hover:border-amber/20 transition-all duration-500">
                  <span className="font-display text-5xl text-amber/10 block mb-4 group-hover:text-amber/20 transition-colors">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-white text-lg font-semibold mb-3">{v.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{v.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ STATS ═══════════════════ */}
      <section className="py-20 border-b border-white/5">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
            <Counter end={250} suffix="+" label="Projects Completed" />
            <Counter end={15} suffix="+" label="Years Experience" duration={1.5} />
            <Counter end={4} label="Sectors" prefix="" duration={1} />
            <Counter end={120} suffix="M+" label="Revenue Generated" prefix="$" />
          </div>
        </div>
      </section>

      {/* ═══════════════════ TIMELINE ═══════════════════ */}
      <section className="py-28 lg:py-36">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-20">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-12 h-px bg-amber" />
                <span className="text-amber text-xs font-semibold tracking-[0.3em] uppercase">Our Journey</span>
                <div className="w-12 h-px bg-amber" />
              </div>
              <h2 className="font-display text-4xl md:text-5xl text-white">Milestones</h2>
            </div>
          </ScrollReveal>

          <div className="relative">
            {/* Center line */}
            <div className="absolute left-4 lg:left-1/2 top-0 bottom-0 w-px bg-white/10 lg:-translate-x-px" />

            <div className="space-y-12">
              {timeline.map((item, i) => (
                <ScrollReveal key={item.year} delay={i * 0.1} direction={i % 2 === 0 ? 'left' : 'right'}>
                  <div className={`relative flex items-start gap-8 lg:gap-0 ${
                    i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}>
                    {/* Dot */}
                    <div className="absolute left-4 lg:left-1/2 w-3 h-3 bg-amber rounded-full -translate-x-1.5 mt-2 z-10 ring-4 ring-void" />

                    {/* Content */}
                    <div className={`pl-12 lg:pl-0 lg:w-1/2 ${i % 2 === 0 ? 'lg:pr-16 lg:text-right' : 'lg:pl-16'}`}>
                      <span className="text-amber font-display text-2xl block mb-2">{item.year}</span>
                      <h3 className="text-white text-lg font-semibold mb-2">{item.title}</h3>
                      <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
                    </div>

                    <div className="hidden lg:block lg:w-1/2" />
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ TEAM ═══════════════════ */}
      <section className="py-28 lg:py-36 bg-void-light border-y border-white/5">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-20">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-12 h-px bg-amber" />
                <span className="text-amber text-xs font-semibold tracking-[0.3em] uppercase">Leadership</span>
                <div className="w-12 h-px bg-amber" />
              </div>
              <h2 className="font-display text-4xl md:text-5xl text-white">Meet Our Team</h2>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <ScrollReveal key={member.name} delay={i * 0.1}>
                <div className="group relative overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full aspect-[4/5] object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-white font-semibold text-lg">{member.name}</h3>
                    <p className="text-amber text-sm">{member.role}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
