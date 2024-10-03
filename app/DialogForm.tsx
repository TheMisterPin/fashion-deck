/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, Controller } from "react-hook-form";

interface DialogFormProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (data: { name: string; file: File | null; type: string }) => Promise<void>;
  isProcessing: boolean;
}

export const DialogForm: React.FC<DialogFormProps> = ({ isOpen, setIsOpen, onSubmit, isProcessing }) => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      name: "",
      file: null,
      type: "",
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="font-bold border-2">
          Add New Item
        </Button>
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
              <Input id="name" placeholder="Name" {...field} className="col-span-3" />
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
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    onChange(e.target.files[0]);
                  }
                }}
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
  );
};
