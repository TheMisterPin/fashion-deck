/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import React, { useState, useEffect, useRef } from "react"
import axios from 'axios'
import {
  env,
  AutoModel,
  AutoProcessor,
} from "@xenova/transformers"
import "onnxruntime-web"
import { processImage } from "@/lib/process"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion, AnimatePresence } from "framer-motion"
import { useForm, Controller } from "react-hook-form"

export default function BackgroundRemover() {
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const modelRef = useRef(null)
  const processorRef = useRef(null)

  const { control, handleSubmit } = useForm({
    defaultValues: {
      name: "",
      file: null,
      type: "",
    },
  })

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
console.log(err)      }
      setIsLoading(false)
    })()
  }, [])

  const onSubmit = async (data) => {
    setIsProcessing(true)

    try {
      const processedFile = await processImage(data.file)

      const formData = new FormData()
      formData.append('image', processedFile)
      formData.append('key', process.env.NEXT_PUBLIC_IMGBB_API_KEY!)

      const response = await axios.post('https://api.imgbb.com/1/upload', formData)
      
      console.log({
        name: data.name,
        image: response.data.data.url,
        type: data.type
      })

      setIsOpen(false)
    } catch (uploadError) {
      console.error('Error processing or uploading image:', uploadError)
    } finally {
      setIsProcessing(false)
    }
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
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto text-center">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="font-bold border-2">Add New Item</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Item</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
              <Controller
                name="name"
                control={control}
                rules={{ required: "Name is required" }}
                render={({ field }) => (
                  <Input
                    id="name"
                    placeholder="Name"
                    {...field}
                    className="col-span-3"
                  />
                )}
              />
              <Controller
                name="file"
                control={control}
                rules={{ required: "File is required" }}
                render={({ field: { onChange, value, ...field } }) => (
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => onChange(e.target.files[0])}
                    {...field}
                    className="col-span-3"
                  />
                )}
              />
              <AnimatePresence>
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Controller
                    name="type"
                    control={control}
                    rules={{ required: "Type is required" }}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="top">Top</SelectItem>
                          <SelectItem value="pants">Pants</SelectItem>
                          <SelectItem value="shoes">Shoes</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </motion.div>
              </AnimatePresence>
              <Button type="submit" disabled={isProcessing}>
                {isProcessing ? "Processing..." : "Submit"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
        {isProcessing && (
          <div>
            <div className="inline-block w-8 h-8 mb-2 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
            <p>Processing image...</p>
          </div>
        )}
      </div>
    </div>
  )
}