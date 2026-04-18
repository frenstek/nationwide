import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import ScrollReveal from '../components/ScrollReveal'
import Counter from '../components/Counter'
import TextReveal from '../components/TextReveal'
import MagneticButton from '../components/MagneticButton'
import ParallaxImage from '../components/ParallaxImage'
import HorizontalScroll from '../components/HorizontalScroll'
import MarqueeText from '../components/MarqueeText'

const services = [
  {
    title: 'Architecture',
    desc: 'Visionary design that balances form, function, and innovation to create spaces that inspire.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <path d="M3 21h18M3 21V8l9-5 9 5v13M9 21V12h6v9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Residential',
    desc: 'Premium homes and living spaces crafted with precision, comfort, and modern elegance.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="9,22 9,12 15,12 15,22" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Commercial',
    desc: 'Dynamic workspaces and retail environments that drive business growth and productivity.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <path d="M2 20h20M4 20V4h8v16M12 8h8v12M8 8h.01M8 12h.01M8 16h.01M16 12h.01M16 16h.01" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Infrastructure',
    desc: 'Large-scale civil works, roads, bridges, and utilities that shape communities and connect regions.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <path d="M2 20h20M6 20V10l3-3M18 20V10l-3-3M9 7h6M12 7V3M6 10h12M8 14h8M10 17h4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
]

const horizontalProjects = [
  {
    title: 'The Meridian Tower',
    category: 'Commercial',
    location: 'Downtown Metro',
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900&h=600&fit=crop',
  },
  {
    title: 'Cascadia Residences',
    category: 'Residential',
    location: 'Hillside District',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&h=600&fit=crop',
  },
  {
    title: 'Metro Gateway Bridge',
    category: 'Infrastructure',
    location: 'River Crossing',
    image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=900&h=600&fit=crop',
  },
  {
    title: 'The Glass Pavilion',
    category: 'Architecture',
    location: 'Cultural District',
    image: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=900&h=600&fit=crop',
  },
  {
    title: 'Harborview Centre',
    category: 'Commercial',
    location: 'Waterfront Precinct',
    image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=900&h=600&fit=crop',
  },
]

export default function Home() {
  const heroRef = useRef(null)
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const heroY = useTransform(heroScroll, [0, 1], ['0%', '30%'])
  const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0])
  const heroScale = useTransform(heroScroll, [0, 1], [1, 1.1])

  return (
    <div className="bg-void">
      {/* ═══════════════════ HERO ═══════════════════ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Parallax background */}
        <motion.div className="absolute inset-0" style={{ y: heroY, scale: heroScale }}>
          <img
            src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1920&h=1080&fit=crop"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-void/80 via-void/60 to-void" />
          <div className="absolute inset-0 bg-gradient-to-r from-void/50 to-transparent" />
        </motion.div>

        {/* Animated grid overlay */}
        <motion.div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(rgba(232,133,12,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(232,133,12,.3) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
          initial={{ backgroundPosition: '0px 0px' }}
          animate={{ backgroundPosition: '80px 80px' }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />

        {/* Content with fade on scroll */}
        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 py-32">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3 mb-8 overflow-hidden"
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 48 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="h-px bg-amber"
              />
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="text-amber text-xs font-semibold tracking-[0.3em] uppercase"
              >
                Building Excellence Since Establishment
              </motion.span>
            </motion.div>

            <TextReveal
              text="We Build"
              className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-white leading-[0.95] mb-2"
              delay={0.4}
            />
            <TextReveal
              text="Landmarks"
              className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-amber leading-[0.95] mb-2"
              delay={0.7}
            />
            <TextReveal
              text="Not Just Buildings"
              className="font-display text-3xl sm:text-5xl md:text-7xl lg:text-8xl text-white leading-[0.95] mb-8"
              delay={1.0}
            />

            <motion.p
              initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, delay: 1.3 }}
              className="text-white/50 text-lg md:text-xl max-w-2xl leading-relaxed mb-12"
            >
              From architectural design to infrastructure delivery, Nationwide Projects
              Investments transforms vision into reality with precision and purpose.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.5 }}
              className="flex flex-wrap gap-4"
            >
              <MagneticButton>
                <Link
                  to="/projects"
                  className="inline-block px-10 py-4 bg-amber text-white font-semibold tracking-wider uppercase text-sm hover:bg-amber-light transition-all duration-300 hover:shadow-xl hover:shadow-amber/20"
                >
                  View Our Work
                </Link>
              </MagneticButton>
              <MagneticButton>
                <Link
                  to="/contact"
                  className="inline-block px-10 py-4 border border-white/20 text-white font-semibold tracking-wider uppercase text-sm hover:bg-white/5 hover:border-white/40 transition-all duration-300"
                >
                  Get in Touch
                </Link>
              </MagneticButton>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-white/30 text-[10px] tracking-[0.3em] uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-px h-8 bg-gradient-to-b from-amber to-transparent"
          />
        </motion.div>
      </section>

      {/* ═══════════════════ MARQUEE ═══════════════════ */}
      <div className="border-y border-white/5 bg-void-light py-5 overflow-hidden">
        <MarqueeText
          text="ARCHITECTURE  ·  RESIDENTIAL  ·  COMMERCIAL  ·  INFRASTRUCTURE  ·  DESIGN & BUILD  ·  PROJECT MANAGEMENT"
          speed={30}
          className="text-white/20 text-sm font-semibold tracking-[0.2em] uppercase"
        />
      </div>

      {/* ═══════════════════ STATS BAR ═══════════════════ */}
      <section className="bg-void-light">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
            <Counter end={250} suffix="+" label="Projects Completed" />
            <Counter end={15} suffix="+" label="Years Experience" duration={1.5} />
            <Counter end={50} suffix="+" label="Expert Team" duration={1.5} />
            <Counter end={98} suffix="%" label="Client Satisfaction" />
          </div>
        </div>
      </section>

      {/* ═══════════════════ ABOUT PREVIEW ═══════════════════ */}
      <section className="py-28 lg:py-36">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal direction="left">
              <div className="relative">
                <ParallaxImage
                  src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=1000&fit=crop"
                  alt="Construction site"
                  className="w-full aspect-[4/5]"
                  speed={0.15}
                />
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4, type: 'spring' }}
                  className="absolute -bottom-6 -right-6 bg-amber p-8 hidden md:block"
                >
                  <span className="font-display text-4xl text-white block">15+</span>
                  <span className="text-white/80 text-sm tracking-wide uppercase">Years</span>
                </motion.div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.2}>
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-px bg-amber" />
                  <span className="text-amber text-xs font-semibold tracking-[0.3em] uppercase">
                    Who We Are
                  </span>
                </div>
                <h2 className="font-display text-4xl md:text-5xl text-white leading-tight mb-6">
                  Shaping Skylines,{' '}
                  <span className="text-amber">Building Futures</span>
                </h2>
                <p className="text-white/50 leading-relaxed mb-6">
                  Nationwide Projects Investments is a leading construction and investment
                  firm delivering excellence across architecture, residential, commercial,
                  and infrastructure sectors. Our commitment to quality, innovation, and
                  sustainability drives every project we undertake.
                </p>
                <p className="text-white/50 leading-relaxed mb-10">
                  We bring together world-class expertise, cutting-edge technology, and a
                  relentless focus on client satisfaction to deliver projects that stand
                  the test of time.
                </p>
                <MagneticButton>
                  <Link
                    to="/about"
                    className="inline-flex items-center gap-2 text-amber font-medium text-sm tracking-wide uppercase group"
                  >
                    Learn More About Us
                    <svg
                      className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </MagneticButton>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════ SERVICES ═══════════════════ */}
      <section className="py-28 lg:py-36 bg-void-light border-y border-white/5">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-20">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-12 h-px bg-amber" />
                <span className="text-amber text-xs font-semibold tracking-[0.3em] uppercase">
                  What We Do
                </span>
                <div className="w-12 h-px bg-amber" />
              </div>
              <h2 className="font-display text-4xl md:text-5xl text-white mb-4">
                Our Core Services
              </h2>
              <p className="text-white/40 max-w-2xl mx-auto">
                Comprehensive construction and investment solutions tailored to bring
                your vision to life.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, i) => (
              <ScrollReveal key={service.title} delay={i * 0.1}>
                <Link
                  to="/services"
                  className="group block p-8 border border-white/5 bg-void hover:border-amber/20 transition-all duration-500 h-full relative overflow-hidden"
                >
                  {/* Animated background fill on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-amber/5 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
                  <div className="relative">
                    <div className="text-amber mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
                      {service.icon}
                    </div>
                    <h3 className="text-white text-lg font-semibold mb-3 group-hover:text-amber transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="text-white/40 text-sm leading-relaxed">
                      {service.desc}
                    </p>
                    <div className="mt-6 flex items-center gap-2 text-amber/0 group-hover:text-amber text-sm font-medium tracking-wide uppercase transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                      Learn More
                      <svg className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ HORIZONTAL SCROLL PROJECTS ═══════════════════ */}
      <section className="border-b border-white/5">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-28 lg:pt-36">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-4 gap-6">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-px bg-amber" />
                  <span className="text-amber text-xs font-semibold tracking-[0.3em] uppercase">
                    Portfolio
                  </span>
                </div>
                <h2 className="font-display text-4xl md:text-5xl text-white">
                  Featured Projects
                </h2>
              </div>
              <MagneticButton>
                <Link
                  to="/projects"
                  className="inline-flex items-center gap-2 text-amber font-medium text-sm tracking-wide uppercase group shrink-0"
                >
                  View All Projects
                  <svg
                    className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </MagneticButton>
            </div>
          </ScrollReveal>
        </div>

        <HorizontalScroll>
          {horizontalProjects.map((project, i) => (
            <Link
              key={project.title}
              to="/projects"
              className="group relative shrink-0 w-[85vw] sm:w-[70vw] md:w-[45vw] lg:w-[35vw] aspect-[3/2] overflow-hidden snap-center"
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-void via-void/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
              <div className="absolute top-6 left-6">
                <span className="px-3 py-1.5 bg-amber/90 text-white text-[10px] font-semibold tracking-wider uppercase">
                  {project.category}
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="text-white text-2xl md:text-3xl font-display mb-1 transition-transform duration-300 group-hover:translate-x-2">
                  {project.title}
                </h3>
                <p className="text-white/40 text-sm">{project.location}</p>
              </div>
              <div className="absolute top-6 right-6 w-12 h-12 border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300 backdrop-blur-sm bg-white/5">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 17L17 7M17 7H7M17 7v10" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </Link>
          ))}
        </HorizontalScroll>
      </section>

      {/* ═══════════════════ WHY CHOOSE US ═══════════════════ */}
      <section className="py-28 lg:py-36 bg-void-light border-b border-white/5">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal>
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-px bg-amber" />
                  <span className="text-amber text-xs font-semibold tracking-[0.3em] uppercase">
                    Why Choose Us
                  </span>
                </div>
                <h2 className="font-display text-4xl md:text-5xl text-white leading-tight mb-10">
                  Excellence in Every{' '}
                  <span className="text-amber">Detail</span>
                </h2>

                <div className="space-y-8">
                  {[
                    {
                      title: 'Quality Craftsmanship',
                      desc: 'Every project is executed with meticulous attention to detail and the highest standards of construction quality.',
                    },
                    {
                      title: 'On-Time Delivery',
                      desc: 'We pride ourselves on meeting deadlines without compromising quality, keeping your project on track.',
                    },
                    {
                      title: 'Transparent Communication',
                      desc: 'Regular updates, clear reporting, and open dialogue throughout every phase of your project.',
                    },
                    {
                      title: 'Sustainable Practices',
                      desc: 'Committed to environmentally responsible construction methods and materials that reduce ecological impact.',
                    },
                  ].map((item, i) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                      className="flex gap-5 group"
                    >
                      <div className="shrink-0 w-10 h-10 border border-amber/30 flex items-center justify-center text-amber font-display text-lg group-hover:bg-amber group-hover:text-white group-hover:border-amber transition-all duration-300">
                        {String(i + 1).padStart(2, '0')}
                      </div>
                      <div>
                        <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                        <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.2}>
              <div className="relative">
                <ParallaxImage
                  src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&h=1000&fit=crop"
                  alt="Architecture"
                  className="w-full aspect-[4/5]"
                  speed={0.15}
                />
                {/* Floating accent frame */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="absolute -top-4 -left-4 w-32 h-32 border-t-2 border-l-2 border-amber/40 pointer-events-none"
                />
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.7 }}
                  className="absolute -bottom-4 -right-4 w-32 h-32 border-b-2 border-r-2 border-amber/40 pointer-events-none"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════ TESTIMONIAL ═══════════════════ */}
      <section className="py-28 lg:py-36">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <ScrollReveal>
            <motion.svg
              initial={{ rotate: -20, scale: 0 }}
              whileInView={{ rotate: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="w-12 h-12 text-amber/30 mx-auto mb-8"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311C9.591 11.69 11 13.185 11 15c0 1.933-1.567 3.5-3.5 3.5-1.29 0-2.44-.702-2.917-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311C19.591 11.69 21 13.185 21 15c0 1.933-1.567 3.5-3.5 3.5-1.29 0-2.44-.702-2.917-1.179z" />
            </motion.svg>
            <blockquote className="font-display text-2xl md:text-3xl lg:text-4xl text-white leading-snug mb-8">
              Nationwide Projects Investments delivered beyond our expectations. Their
              attention to detail and commitment to excellence transformed our vision
              into a stunning reality.
            </blockquote>
            <div>
              <p className="text-white font-semibold">David Chen</p>
              <p className="text-white/40 text-sm">CEO, Meridian Developments</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════ BOTTOM MARQUEE ═══════════════════ */}
      <div className="border-t border-white/5 py-5 overflow-hidden">
        <MarqueeText
          text="LET'S BUILD TOGETHER  ·  GET IN TOUCH  ·  START YOUR PROJECT  ·  NATIONWIDE PROJECTS INVESTMENTS"
          speed={25}
          className="text-white/10 text-lg font-display tracking-wider"
        />
      </div>
    </div>
  )
}
