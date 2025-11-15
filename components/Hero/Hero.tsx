/**
 * Hero Section Component
 * Modern hero section with dynamic grid background and scroll animations
 */

import React, { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'
import { GlassButton } from '@/components/ui/GlassCard'

interface HeroProps {
  title: string
  subtitle: string
  cta?: {
    text: string
    href: string
    variant?: 'primary' | 'secondary'
  }
  background?: 'grid' | 'gradient' | 'particles'
}

export function Hero({
  title,
  subtitle,
  cta,
  background = 'grid'
}: HeroProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll({
    target: ref,
    offset: ['start start', 'end start']
  })

  // Parallax transformations
  const y = useTransform(scrollY, [0, 500], [0, 150])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])
  const scale = useTransform(scrollY, [0, 500], [1, 0.9])

  // Staggered animation state
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: 'easeOut'
      }
    }
  }

  const scrollIndicatorVariants = {
    animate: {
      y: [0, 10, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  }

  return (
    <section
      ref={ref}
      className={cn(
        'relative min-h-screen flex items-center justify-center overflow-hidden',
        'bg-background text-foreground'
      )}
    >
      {/* Background layers */}
      {background === 'grid' && (
        <>
          {/* Animated grid background */}
          <motion.div
            className="absolute inset-0 bg-grid-white/[0.02]"
            style={{ y }}
          >
            <GridLines count={20} className="opacity-30" />
          </motion.div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
        </>
      )}

      {background === 'particles' && (
        <div className="absolute inset-0">
          <Particles count={50} />
        </div>
      )}

      {background === 'gradient' && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
      )}

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-5xl mx-auto px-6 text-center"
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? 'visible' : 'hidden'}
        style={{ opacity, scale }}
      >
        {/* Main title with gradient text */}
        <motion.h1
          className={cn(
            'mb-6 font-extrabold tracking-tight',
            'text-5xl md:text-7xl lg:text-8xl',
            'bg-gradient-to-r from-foreground via-foreground to-accent bg-clip-text text-transparent'
          )}
          variants={itemVariants}
        >
          {title}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className={cn(
            'mx-auto mb-10 max-w-2xl',
            'text-xl md:text-2xl text-muted-foreground'
          )}
          variants={itemVariants}
        >
          {subtitle}
        </motion.p>

        {/* CTA Button */}
        {cta && (
          <motion.div variants={itemVariants}>
            <GlassButton
              size="xl"
              variant={(cta.variant as 'default' | 'elevated' | 'flat') || 'elevated'}
              as="a"
              {...({ href: cta.href } as any)}
            >
              <span className="inline-flex items-center">
                {cta.text}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </span>
            </GlassButton>
          </motion.div>
        )}
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        variants={scrollIndicatorVariants}
        animate="animate"
        aria-hidden="true"
      >
        <ChevronDown className="w-6 h-6 text-muted-foreground" />
      </motion.div>
    </section>
  )
}

/**
 * Grid lines background component
 */
interface GridLinesProps {
  count?: number
  className?: string
  spacing?: number
}

function GridLines({ count = 20, className, spacing = 40 }: GridLinesProps) {
  return (
    <svg
      className={cn('absolute inset-0 w-full h-full', className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="grid" width={spacing} height={spacing} patternUnits="userSpaceOnUse">
          <path d={`M ${spacing} 0 L 0 0 0 ${spacing}`} fill="none" stroke="currentColor" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  )
}

/**
 * Particles background component
 */
interface ParticlesProps {
  count?: number
}

function Particles({ count = 50 }: ParticlesProps) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    opacity: Math.random() * 0.5 + 0.2,
    delay: Math.random() * 5
  }))

  return (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-primary/30"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [particle.opacity, particle.opacity * 0.5, particle.opacity]
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  )
}

/*
 * Hero icons (from lucide-react)
 */
function ChevronDown(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  )
}

function ArrowRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

export default Hero
