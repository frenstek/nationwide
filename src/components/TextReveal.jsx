import { motion } from 'framer-motion'

export default function TextReveal({ text, className = '', delay = 0, tag = 'h1' }) {
  const words = text.split(' ')
  const Tag = tag

  const container = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: delay,
      },
    },
  }

  const wordAnim = {
    hidden: {
      y: '120%',
      rotateX: -40,
      opacity: 0,
    },
    visible: {
      y: '0%',
      rotateX: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  }

  return (
    <Tag className={className}>
      <motion.span
        variants={container}
        initial="hidden"
        animate="visible"
        className="flex flex-wrap"
        style={{ perspective: '600px' }}
      >
        {words.map((word, i) => (
          <span key={i} className="overflow-hidden mr-[0.3em] inline-block">
            <motion.span
              variants={wordAnim}
              className="inline-block will-change-transform"
              style={{ transformOrigin: 'bottom center' }}
            >
              {word}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  )
}
