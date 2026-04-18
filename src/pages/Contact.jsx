import { useState } from 'react'
import { motion } from 'framer-motion'
import ScrollReveal from '../components/ScrollReveal'

const contactInfo = [
  {
    title: 'Visit Our Office',
    lines: ['123 Construction Way', 'Metro City, MC 10001'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    title: 'Call Us',
    lines: ['+1 (555) 123-4567', '+1 (555) 987-6543'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Email Us',
    lines: ['info@nationwidepi.com', 'projects@nationwidepi.com'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="22,6 12,13 2,6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Business Hours',
    lines: ['Mon — Fri: 8:00 AM — 6:00 PM', 'Sat: 9:00 AM — 2:00 PM'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12,6 12,12 16,14" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
]

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    budget: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 4000)
  }

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div className="bg-void">
      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="relative min-h-[50vh] md:min-h-[60vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1920&h=1080&fit=crop"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-void via-void/70 to-void/30" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 pb-16 pt-28 md:pb-20 md:pt-40">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-px bg-amber" />
            <span className="text-amber text-xs font-semibold tracking-[0.3em] uppercase">Get in Touch</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-white leading-[0.95] mb-6">
            Let's Build<br /><span className="text-amber">Something Great</span>
          </h1>
          <p className="text-white/50 text-lg max-w-2xl">
            Have a project in mind? We'd love to hear from you. Reach out and let's
            discuss how we can bring your vision to life.
          </p>
        </div>
      </section>

      {/* ═══════════════════ CONTACT INFO CARDS ═══════════════════ */}
      <section className="py-20 border-b border-white/5">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, i) => (
              <ScrollReveal key={info.title} delay={i * 0.1}>
                <div className="p-8 border border-white/5 bg-void-light h-full group hover:border-amber/20 transition-all duration-500">
                  <div className="text-amber mb-4">{info.icon}</div>
                  <h3 className="text-white font-semibold mb-3">{info.title}</h3>
                  {info.lines.map((line) => (
                    <p key={line} className="text-white/40 text-sm">{line}</p>
                  ))}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ FORM + MAP ═══════════════════ */}
      <section className="py-28 lg:py-36">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-16">
            {/* Form */}
            <div className="lg:col-span-3">
              <ScrollReveal>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-px bg-amber" />
                  <span className="text-amber text-xs font-semibold tracking-[0.3em] uppercase">
                    Send a Message
                  </span>
                </div>
                <h2 className="font-display text-4xl text-white mb-10">
                  Tell Us About Your Project
                </h2>

                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-10 border border-amber/20 bg-amber/5 text-center"
                  >
                    <div className="w-16 h-16 border-2 border-amber rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-amber" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20,6 9,17 4,12" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <h3 className="text-white text-xl font-semibold mb-2">Message Sent!</h3>
                    <p className="text-white/50">
                      Thank you for reaching out. Our team will get back to you within 24 hours.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-white/40 text-xs font-semibold tracking-wider uppercase mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full bg-transparent border border-white/10 px-5 py-3.5 text-white text-sm placeholder:text-white/20 focus:border-amber focus:outline-none transition-colors"
                          placeholder="John Smith"
                        />
                      </div>
                      <div>
                        <label className="block text-white/40 text-xs font-semibold tracking-wider uppercase mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full bg-transparent border border-white/10 px-5 py-3.5 text-white text-sm placeholder:text-white/20 focus:border-amber focus:outline-none transition-colors"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-white/40 text-xs font-semibold tracking-wider uppercase mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full bg-transparent border border-white/10 px-5 py-3.5 text-white text-sm placeholder:text-white/20 focus:border-amber focus:outline-none transition-colors"
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                      <div>
                        <label className="block text-white/40 text-xs font-semibold tracking-wider uppercase mb-2">
                          Service Required
                        </label>
                        <select
                          name="service"
                          value={formData.service}
                          onChange={handleChange}
                          className="w-full bg-void border border-white/10 px-5 py-3.5 text-white text-sm focus:border-amber focus:outline-none transition-colors appearance-none cursor-pointer"
                        >
                          <option value="">Select a service</option>
                          <option value="architecture">Architecture</option>
                          <option value="residential">Residential</option>
                          <option value="commercial">Commercial</option>
                          <option value="infrastructure">Infrastructure</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-white/40 text-xs font-semibold tracking-wider uppercase mb-2">
                        Estimated Budget
                      </label>
                      <select
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="w-full bg-void border border-white/10 px-5 py-3.5 text-white text-sm focus:border-amber focus:outline-none transition-colors appearance-none cursor-pointer"
                      >
                        <option value="">Select budget range</option>
                        <option value="<100k">Under $100,000</option>
                        <option value="100k-500k">$100,000 — $500,000</option>
                        <option value="500k-1m">$500,000 — $1,000,000</option>
                        <option value="1m-5m">$1,000,000 — $5,000,000</option>
                        <option value="5m+">$5,000,000+</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-white/40 text-xs font-semibold tracking-wider uppercase mb-2">
                        Project Details *
                      </label>
                      <textarea
                        name="message"
                        required
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full bg-transparent border border-white/10 px-5 py-3.5 text-white text-sm placeholder:text-white/20 focus:border-amber focus:outline-none transition-colors resize-none"
                        placeholder="Tell us about your project, timeline, and any specific requirements..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-10 py-4 bg-amber text-white font-semibold tracking-wider uppercase text-sm hover:bg-amber-light transition-all duration-300 hover:shadow-lg hover:shadow-amber/20"
                    >
                      Send Message
                    </button>
                  </form>
                )}
              </ScrollReveal>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2">
              <ScrollReveal delay={0.2}>
                <div className="bg-void-light border border-white/5 p-10 mb-8">
                  <h3 className="text-white font-semibold text-lg mb-4">Why Work With Us?</h3>
                  <div className="space-y-4">
                    {[
                      '15+ years of industry experience',
                      '250+ successful projects delivered',
                      '98% client satisfaction rate',
                      'Full in-house design & build team',
                      'Transparent pricing, no hidden costs',
                      'On-time, on-budget delivery guarantee',
                    ].map((item) => (
                      <div key={item} className="flex items-start gap-3">
                        <svg className="w-4 h-4 text-amber shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="20,6 9,17 4,12" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="text-white/50 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-amber/5 border border-amber/20 p-10">
                  <h3 className="text-amber font-semibold text-lg mb-3">Quick Response</h3>
                  <p className="text-white/50 text-sm leading-relaxed mb-4">
                    Need to speak with someone right away? Call our project hotline for
                    immediate assistance.
                  </p>
                  <a
                    href="tel:+15551234567"
                    className="text-white text-xl font-display block hover:text-amber transition-colors"
                  >
                    +1 (555) 123-4567
                  </a>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
