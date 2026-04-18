import { useEffect, useState } from 'react'
import { motion, useSpring } from 'framer-motion'

export default function CursorFollower() {
  const [visible, setVisible] = useState(false)
  const [hoveringLink, setHoveringLink] = useState(false)

  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 }
  const x = useSpring(0, springConfig)
  const y = useSpring(0, springConfig)

  useEffect(() => {
    // Only show on desktop
    if (window.matchMedia('(pointer: coarse)').matches) return

    const moveCursor = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
      setVisible(true)
    }

    const handleOver = (e) => {
      const target = e.target.closest('a, button, [data-cursor-hover]')
      setHoveringLink(!!target)
    }

    window.addEventListener('mousemove', moveCursor)
    window.addEventListener('mouseover', handleOver)
    return () => {
      window.removeEventListener('mousemove', moveCursor)
      window.removeEventListener('mouseover', handleOver)
    }
  }, [x, y])

  if (!visible) return null

  return (
    <>
      {/* Outer ring */}
      <motion.div
        style={{ x, y }}
        className={`fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference transition-[width,height] duration-300 ${
          hoveringLink ? 'w-16 h-16' : 'w-8 h-8'
        }`}
      >
        <div
          className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border transition-all duration-300 ${
            hoveringLink
              ? 'w-16 h-16 border-amber bg-amber/10'
              : 'w-8 h-8 border-white/40'
          }`}
        />
      </motion.div>
      {/* Inner dot */}
      <motion.div
        style={{ x, y }}
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
      >
        <div className="w-1.5 h-1.5 bg-amber rounded-full -translate-x-1/2 -translate-y-1/2" />
      </motion.div>
    </>
  )
}
