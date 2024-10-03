"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  env,
  AutoModel,
  AutoProcessor,
} from "@/transformers"
import "onnxruntime-web"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function BackgroundRemoverDialogComponent() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [processedImage, setProcessedImage] = useState(null)

  const modelRef = useRef(null)
  const processorRef = useRef(null)

  useEffect(() => {
    (async () => {
      try {
        if (!navigator.gpu) {
          throw new Error("WebGPU is not supported in this browser.")
        }
        const model_id = "Xenova/modnet"
        env.backends.onnx.wasm.proxy = false
        modelRef.current ??= await AutoModel.from_pretrained(model_id, {
          device: "webgpu",
        })
        processorRef.current ??= await AutoProcessor.from_pretrained(model_id)
      } catch (err) {
        setError(err)
      }
      setIsLoading(false)
    })()
  }, [])

  const processImage = async (file) => {
    setIsProcessing(true)
    try {
      const image = await createImageBitmap(file)
      const { pixel_values } = await processorRef.current(image)
      const output = await modelRef.current(pixel_values)
      const mask = output.pred_masks[0]

      const canvas = document.createElement('canvas')
      canvas.width = image.width
      canvas.height = image.height
      const ctx = canvas.getContext('2d')

      ctx.drawImage(image, 0, 0)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < mask.data.length; i++) {
        imageData.data[i * 4 + 3] = mask.data[i] * 255
      }

      ctx.putImageData(imageData, 0, 0)
      const processedDataUrl = canvas.toDataURL('image/png')
      setProcessedImage(processedDataUrl)
    } catch (err) {
      console.error("Error processing image:", err)
      setError(err)
    }
    setIsProcessing(false)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (selectedFile) {
      await processImage(selectedFile)
    }
  }

  const downloadProcessedImage = () => {
    if (processedImage) {
      const link = document.createElement('a')
      link.href = processedImage
      link.download = 'processed-image.png'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white bg-black">
        <div className="text-center">
          <h2 className="mb-2 text-4xl">ERROR</h2>
          <p className="text-xl max-w-[500px]">{error.message}</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white bg-black">
        <div className="text-center">
          <div className="inline-block w-8 h-8 mb-4 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
          <p className="text-lg">Loading background removal model...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Remove Background</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Remove Image Background</DialogTitle>
          </DialogHeader>
          <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
            <div className="grid items-center grid-cols-4 gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" className="col-span-3" />
            </div>
            <div className="grid items-center grid-cols-4 gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <AnimatePresence>
                    {["Photo", "Illustration", "Other"].map((item) => (
                      <motion.div
                        key={item}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <SelectItem value={item.toLowerCase()}>{item}</SelectItem>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </SelectContent>
              </Select>
            </div>
            <div className="grid items-center grid-cols-4 gap-4">
              <Label htmlFor="picture" className="text-right">
                Picture
              </Label>
              <Input
                id="picture"
                type="file"
                className="col-span-3"
                accept="image/*"
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />
            </div>
            <Button type="submit" className="mt-4" disabled={isProcessing}>
              {isProcessing ? "Processing..." : "Remove Background"}
            </Button>
          </form>
          {processedImage && (
            <div className="mt-4">
              <img src={processedImage} alt="Processed" className="w-full h-auto" />
              <Button onClick={downloadProcessedImage} className="w-full mt-2">
                Download Processed Image
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}