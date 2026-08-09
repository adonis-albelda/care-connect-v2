'use client'

import React from 'react'
import { motion, useReducedMotion } from 'motion/react'

export interface TestimonialColumnItem {
  id: number | string
  text: string
  name: string
  role: string
}

export const TestimonialsColumn = (props: {
  className?: string
  testimonials: TestimonialColumnItem[]
  duration?: number
}) => {
  const reduceMotion = useReducedMotion()

  if (!props.testimonials.length) return null

  return (
    <div className={props.className}>
      <motion.div
        animate={reduceMotion ? undefined : { translateY: '-50%' }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: 'linear',
          repeatType: 'loop',
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[...new Array(reduceMotion ? 1 : 2).fill(0).map((_, index) => (
          <React.Fragment key={index}>
            {props.testimonials.map(({ text, name, role, id }) => (
              <div className="w-full max-w-xs rounded-2xl bg-white/10 p-8" key={`${index}-${id}`}>
                <p className="text-body text-white">{text}</p>
                <div className="mt-5 flex items-center gap-3">
                  <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-blue-light font-headline text-body font-semibold text-connect-blue">
                    {name.charAt(0).toUpperCase()}
                  </span>
                  <div className="flex flex-col">
                    <div className="font-medium capitalize leading-5 text-white">{name}</div>
                    <div className="text-small leading-5 text-blue-light">{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))]}
      </motion.div>
    </div>
  )
}
