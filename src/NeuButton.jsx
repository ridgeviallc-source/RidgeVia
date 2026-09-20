import { motion } from 'motion/react'
import { useDesign } from './design'
import { spring } from './neu'

const tones = {
  surface: 'text-foreground',
  primary: 'bg-primary text-primary-foreground',
}
const sizes = {
  md: 'h-[52px] px-6 text-[17px]',
  lg: 'h-16 px-8 text-[18px]',
}

// Raised at rest, lifts on hover, presses into the surface on tap. No transition-* classes:
// Motion owns these properties and CSS transitions on top of it cause stutter.
export default function NeuButton({ as = 'button', tone = 'surface', size = 'md', className = '', children, ...props }) {
  const { neu } = useDesign()
  const Comp = as === 'a' ? motion.a : motion.button
  return (
    <Comp
      style={{ boxShadow: neu.raisedSm }}
      whileHover={{ boxShadow: neu.raisedLift, y: -1 }}
      whileTap={{ boxShadow: neu.pressed, scale: 0.98, y: 0 }}
      transition={spring}
      className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl font-bold whitespace-nowrap ${tones[tone]} ${sizes[size]} ${className}`}
      {...(as === 'button' ? { type: 'button' } : {})}
      {...props}
    >
      {children}
    </Comp>
  )
}
