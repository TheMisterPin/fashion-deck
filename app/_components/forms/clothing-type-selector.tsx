import React from 'react'
import { Button } from '@/components/ui/button'

type ClothingTypeSelectorProps = {
  icon: React.ReactNode
  label: string
  onClick: () => void
  selected: boolean
}

export default function ClothingTypeSelector({ icon, label, onClick, selected }: ClothingTypeSelectorProps) {
  return (
    <Button
      onClick={onClick}
      variant={selected ? "default" : "outline"}
      className="flex flex-col items-center justify-center w-24 h-24"
    >
      {icon}
      <span className="mt-2">{label}</span>
    </Button>
  )
}