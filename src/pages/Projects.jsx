import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ScrollReveal from '../components/ScrollReveal'

const categories = ['All', 'Architecture', 'Residential', 'Commercial', 'Infrastructure']

const projects = [
  {
    title: 'The Meridian Tower',
    category: 'Commercial',
    location: 'Downtown Metro',
    year: '2025',
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&h=600&fit=crop',
    size: 'large',
  },
  {
    title: 'Cascadia Residences',
    category: 'Residential',
    location: 'Hillside District',
    year: '2024',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
    size: 'normal',
  },
  {
    title: 'Metro Gateway Bridge',
    category: 'Infrastructure',
    location: 'River Crossing',
    year: '2024',
    image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=600&fit=crop',
    size: 'normal',
  },
  {
    title: 'Harborview Centre',
    category: 'Architecture',
    location: 'Waterfront Precinct',
    year: '2025',
    image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&h=600&fit=crop',
    size: 'large',
  },
  {
    title: 'Oakwood Estates',
    category: 'Residential',
    location: 'Suburban East',
    year: '2023',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
    size: 'normal',
  },
  {
    title: 'Nexus Business Park',
    category: 'Commercial',
    location: 'Innovation Quarter',
    year: '2023',
    image: 'https://images.unsplash.com/photo-1554435493-93422e8220c8?w=800&h=600&fit=crop',
    size: 'normal',
  },
  {
    title: 'Coastal Highway Extension',
    category: 'Infrastructure',
    location: 'Southern Corridor',
    year: '2024',
    image: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800&h=600&fit=crop',
    size: 'normal',
  },
  {
    title: 'The Glass Pavilion',
    category: 'Architecture',
    location: 'Cultural District',
    year: '2025',
    image: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=800&h=600&fit=crop',
    size: 'large',
  },
  {
    title: 'Summit Villas',
    category: 'Residential',
    location: 'Mountain View',
    year: '2022',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop',
    size: 'normal',
  },
  {
    title: 'District Mall Complex',
    category: 'Commercial',
    location: 'Central Business',
    year: '2023',
    image: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=800&h=600&fit=crop',
    size: 'normal',
  },
  {
    title: 'Aqua Treatment Plant',
    category: 'Infrastructure',
    location: 'Northern Region',
    year: '2022',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop',
    size: 'normal',
  },
  {
    title: 'The Prism Center',
    category: 'Architecture',
    location: 'Arts District',
    year: '2024',
    image: 'https://images.unsplash.com/photo-1448630360428-65456885c650?w=800&h=600&fit=crop',
    size: 'normal',
  },
]

export default function Projects() {
  const [filter, setFilter] = useState('All')

  const filtered = filter === 'All' ? projects : projects.filter((p) => p.category === filter)

  return (
    <div className="bg-void">
      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="relative min-h-[60vh] md:min-h-[70vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1486718448742-163732cd1544?w=1920&h=1080&fit=crop"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-void via-void/70 to-void/30" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 pb-16 pt-28 md:pb-20 md:pt-40">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-px bg-amber" />
            <span className="text-amber text-xs font-semibold tracking-[0.3em] uppercase">Portfolio</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-white leading-[0.95] mb-6">
            Our <span className="text-amber">Projects</span>
          </h1>
          <p className="text-white/50 text-lg max-w-2xl">
            Explore our portfolio of landmark projects spanning architecture, residential,
            commercial, and infrastructure sectors.
          </p>
        </div>
      </section>

      {/* ═══════════════════ FILTER + GRID ═══════════════════ */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Filters */}
          <ScrollReveal>
            <div className="flex flex-wrap gap-2 mb-14">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-5 py-2.5 text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
                    filter === cat
                      ? 'bg-amber text-white'
                      : 'text-white/40 border border-white/10 hover:text-white hover:border-white/20'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </ScrollReveal>

          {/* Project Grid */}
          <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((project) => (
                <motion.div
                  key={project.title}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className={project.size === 'large' ? 'md:col-span-2 lg:col-span-2' : ''}
                >
                  <div className="group relative overflow-hidden cursor-pointer aspect-[4/3]">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-void via-void/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />

                    {/* Category badge */}
                    <div className="absolute top-6 left-6">
                      <span className="px-3 py-1.5 bg-amber/90 text-white text-[10px] font-semibold tracking-wider uppercase">
                        {project.category}
                      </span>
                    </div>

                    {/* Info overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <h3 className="text-white text-xl md:text-2xl font-display mb-2">
                        {project.title}
                      </h3>
                      <div className="flex items-center gap-4 text-white/50 text-sm">
                        <span className="flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                          {project.location}
                        </span>
                        <span>{project.year}</span>
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="absolute top-6 right-6 w-10 h-10 border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M7 17L17 7M17 7H7M17 7v10" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
