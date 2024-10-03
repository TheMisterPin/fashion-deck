"use client"

import { useState, useEffect, useRef } from "react"
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
import { motion, AnimatePresence } from "framer-motion"

// Import necessary packages for background removal
import {
  env,
  AutoModel,
  AutoProcessor,
  RawImage,
} from "@huggingface/transformers"
import "onnxruntime-web"

export default function UploadForm() {
  // State variables for dialog open state and form inputs
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState("")
  const [type, setType] = useState("")
  const [picture, setPicture] = useState(null)

  // State variables for loading and error
  const [isModelLoading, setIsModelLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)

  const modelRef = useRef(null)
  const processorRef = useRef(null)

 
  useEffect(() => {
    ;(async () => {
      try {
        if (!navigator.gpu) {
          throw new Error("WebGPU is not supported in this browser.")
        }
        const model_id = "Xenova/modnet"
        env.backends.onnx.wasm.proxy = false
        modelRef.current = await AutoModel.from_pretrained(model_id, {
          device: "webgpu",
        })
        processorRef.current = await AutoProcessor.from_pretrained(model_id)
      } catch (err) {
        console.error("Error loading model:", err)
        
      } finally {
        setIsModelLoading(false)
      }
    })()
  }, [])

  // Handle picture input change
  const handlePictureChange = (e) => {
    setPicture(e.target.files[0])
  }

  // Function to process the image
  const processImage = async (imageFile) => {
    const model = modelRef.current
    const processor = processorRef.current

    if (!model || !processor) {
      throw new Error("Model or processor not loaded yet.")
    }

    const img = await RawImage.fromURL(URL.createObjectURL(imageFile))
    // Pre-process image
    const { pixel_values } = await processor(img)
    // Predict alpha matte
    const { output } = await model({ input: pixel_values })

    const maskData = (
      await RawImage.fromTensor(output[0].mul(255).to("uint8")).resize(
        img.width,
        img.height
      )
    ).data

    // Create new canvas
    const canvas = document.createElement("canvas")
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext("2d")
    if (!ctx) throw new Error("Could not get 2D context")
    // Draw original image output to canvas
    ctx.drawImage(img.toCanvas(), 0, 0)

    // Update alpha channel
    const pixelData = ctx.getImageData(0, 0, img.width, img.height)
    for (let i = 0; i < maskData.length; ++i) {
      pixelData.data[4 * i + 3] = maskData[i]
    }
    ctx.putImageData(pixelData, 0, 0)
    // Convert canvas to blob
    const blob = await new Promise((resolve, reject) =>
      canvas.toBlob((blob) => (blob ? resolve(blob) : reject()), "image/png")
    )
    const [fileName] = imageFile.name.split(".")
    const processedFile = new File([blob], `${fileName}-bg-removed.png`, {
      type: "image/png",
    })
    return processedFile
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Ensure a picture is selected
    if (!picture) {
      alert("Please select a picture to upload.")
      return
    }

    // Ensure model is loaded
    if (isModelLoading) {
      alert("Model is still loading. Please wait.")
      return
    }

    setIsProcessing(true)

    try {
      // Process the image to remove background
      const processedImage = await processImage(picture)

      // Create a FormData object to send to Imgbb
      const formData = new FormData()
      formData.append("key", "f97527453a143038402b54df52f4ef83") // Replace with your API key
      formData.append("image", processedImage)

      // Upload image to Imgbb
      const response = await fetch("https://api.imgbb.com/1/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        const imageUrl = data.data.url
        const formObject = {
          name,
          type,
          imageUrl,
        }
        console.log(formObject)
        // Optionally, you can reset the form here
        setName("")
        setType("")
        setPicture(null)
        // Close the dialog
        setIsOpen(false)
      } else {
        console.error("Image upload failed:", data.error)
      }
    } catch (error) {
      console.error("Error processing or uploading image:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Upload Item</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Item</DialogTitle>
        </DialogHeader>
        <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
          {/* Name Input */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              className="col-span-3"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          {/* Type Select */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Type
            </Label>
            <Select value={type} onValueChange={setType} required>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent>
                <AnimatePresence>
                  {["Top", "Pants", "Shoes"].map((item) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <SelectItem value={item.toLowerCase()}>
                        {item}
                      </SelectItem>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </SelectContent>
            </Select>
          </div>
          {/* Picture Input */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="picture" className="text-right">
              Picture
            </Label>
            <Input
              id="picture"
              type="file"
              className="col-span-3"
              accept="image/*"
              onChange={handlePictureChange}
              required
            />
          </div>
      
          {/* Loading indicator */}
          {isProcessing && (
            <div className="col-span-4 text-center text-gray-500">
              Processing image, please wait...
            </div>
          )}
          {/* Submit Button */}
          <Button type="submit" className="mt-4" disabled={isProcessing}>
            Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
