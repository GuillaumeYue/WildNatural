import { motion, useReducedMotion } from 'framer-motion'

/**
 * Scroll-triggered fade-and-slide. Children fade in and rise slightly
 * the first time they scroll into view. Restrained by design — short
 * distance, ease-out, no bounce — to match the editorial brand feel.
 *
 * Respects prefers-reduced-motion (skips the slide, keeps a soft fade).
 *
 * Props:
 *   delay  — stagger offset in seconds (for sequencing siblings)
 *   y      — slide distance in px (default 24)
 *   className — passed through to the wrapper
 */
export default function FadeIn({
  children,
  delay = 0,
  y = 24,
  className = '',
}) {
  const reduce = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -80px 0px' }}
      transition={{ duration: reduce ? 0.3 : 0.5, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  )
}
