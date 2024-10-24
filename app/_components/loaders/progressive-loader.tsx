'use client'

import React, { useEffect, useState } from 'react'
import { CheckCircle2, Circle, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  Card, CardContent, CardHeader, CardTitle,
} from '@/components/ui/card'

export default function ProgressiveLoader({ status } :{ status : string }) {
  const [showIframe, setShowIframe] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  const steps = ['Step1', 'Step2', 'Step3', 'Complete']

  useEffect(() => {
    if (status === 'Complete') {
      setShowIframe(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [status])

  const springVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 20,
      },
    },
    exit: {
      scale: 0,
      opacity: 0,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 20,
      },
    },
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            variants={springVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">
                  {showIframe ? 'Complete!' : 'Loading...'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AnimatePresence mode="wait">
                  {!showIframe ? (
                    <motion.ul
                    key="steps"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    {steps.map((step, index) => (
                    <motion.li
                    key={step}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 text-lg"
                  >
                    {steps.indexOf(step) < steps.indexOf(status) ? (
                    <CheckCircle2 className="text-primary h-5 w-5" />
                  ) : step === status ? (
                    <Loader2 className="animate-spin text-primary h-5 w-5" />
                  ) : (
                    <Circle className="text-muted-foreground h-5 w-5" />
                  )}
                    <span
                    className={cn(
														  'text-sm font-medium',
														  steps.indexOf(step) <= steps.indexOf(status)
														    ? 'text-foreground'
														    : 'text-muted-foreground',
                    )}
                  >
                    {step}
                  </span>
                  </motion.li>
                  ))}
                  </motion.ul>
                  ) : (
                  <motion.div
                  key="iframe"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <iframe
                  src="https://lottie.host/embed/4179f226-b920-455f-af17-b315578ea617/VMMbauLpUp.json"
                  className="w-full h-64 rounded-md border border-input"
                  title="Loaded Content"
                />
                </motion.div>
                  )}
                </AnimatePresence>

              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
