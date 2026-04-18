import { motion } from 'framer-motion'

export default function MarqueeText({ text, speed = 20, className = '' }) {
  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
        className="inline-flex"
      >
        {[...Array(4)].map((_, i) => (
          <span key={i} className="inline-flex items-center">
            <span className="mx-4">{text}</span>
            <span className="mx-4 text-amber">&#x2726;</span>
          </span>
        ))}
      </motion.div>
    </div>
  )
}
