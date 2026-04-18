import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

export default function Counter({ end, suffix = '', prefix = '', duration = 2, label }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return
    let start = 0
    const step = end / (duration * 60)
    const timer = setInterval(() => {
      start += step
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 1000 / 60)
    return () => clearInterval(timer)
  }, [isInView, end, duration])

  return (
    <div ref={ref} className="text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="font-display text-5xl md:text-6xl lg:text-7xl text-white mb-2"
      >
        {prefix}
        {count.toLocaleString()}
        <span className="text-amber">{suffix}</span>
      </motion.div>
      <p className="text-white/40 text-sm tracking-[0.15em] uppercase font-medium">{label}</p>
    </div>
  )
}
