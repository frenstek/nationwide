import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function HorizontalScroll({ children, className = '' }) {
  const containerRef = useRef(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-60%'])

  // Mobile: horizontal swipe carousel
  if (isMobile) {
    return (
      <section className={className}>
        <div className="overflow-x-auto scrollbar-hide pb-6">
          <div className="flex gap-5 px-6 snap-x snap-mandatory" style={{ WebkitOverflowScrolling: 'touch' }}>
            {children}
          </div>
        </div>
      </section>
    )
  }

  // Desktop: scroll-jacking horizontal scroll
  return (
    <section ref={containerRef} className={`relative h-[300vh] ${className}`}>
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <motion.div style={{ x }} className="flex gap-8 pl-16">
          {children}
        </motion.div>
      </div>
    </section>
  )
}
