'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

export default function OnboardingForm() {
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const router = useRouter()

  useEffect(() => {}, [name])

  const handleNextStep = () => {
    setStep(step + 1)
  }

  const handleSkip = () => {
    setStep(step + 1)
  }

  const handleFinish = () => {
    router.push('/dashboard')
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{step === 1 ? 'Welcome!' : step === 2 ? 'Add Clothing' : 'Create Outfit'}</CardTitle>
          <CardDescription>
            {step === 1
              ? "Let's get started with your account"
              : step === 2
                ? 'Add a piece of clothing to your wardrobe'
                : 'Create your first outfit'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}
          {step === 2 && <p>Here you can add logic to add clothing items.</p>}
          {step === 3 && <p>Here you can add logic to create an outfit.</p>}
        </CardContent>
        <CardFooter className="flex justify-between">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={handleSkip}
            >
              Skip
            </Button>
          )}
          {step < 3 ? (
            <Button
              onClick={handleNextStep}
              disabled={step === 1 && !name}
            >
              {step === 1 ? 'Get Started' : 'Next'}
            </Button>
          ) : (
            <Button onClick={handleFinish}>Go to Dashboard</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
