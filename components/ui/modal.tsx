
import { ReactNode } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LucideIcon } from 'lucide-react';

type ModalProps = {
  description: string;
  title: string;
  triggerText: string;
  children: ReactNode;
  open: boolean;
  icon? : LucideIcon
  onOpenChange: (open: boolean) => void;
};

export default function Modal({ description, title, triggerText, children, open, onOpenChange }: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        
        <Button>{triggerText}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <p>{description}</p>}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
