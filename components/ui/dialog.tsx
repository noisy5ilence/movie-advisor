'use client';

import * as React from 'react';
import { useState } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils';

const Dialog = DialogPrimitive.Root;

const DialogPortal = ({ ...props }: DialogPrimitive.DialogPortalProps) => <DialogPrimitive.Portal {...props} />;
DialogPortal.displayName = DialogPrimitive.Portal.displayName;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Overlay ref={ref} {...props}>
    <div
      className={cn(
        'fixed inset-0 z-50 bg-black/60 duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        className
      )}
    >
      {children}
    </div>
  </DialogPrimitive.Overlay>
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & { onClose?: () => void }
>(({ className, children, ...props }, ref) => {
  return (
    <DialogPortal>
      <DialogOverlay className='overflow-auto flex justify-center select-none'>
        <div className='absolute top-[20vh] max-w-[1000px] w-[calc(100%-24px)] gap-4 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-50 data-[state=open]:zoom-in-50 select-none'>
          <DialogPrimitive.Content
            ref={ref}
            className={cn('gap-4 border bg-background p-6 shadow-lg rounded-xl relative', className)}
            {...props}
          >
            {children}
            <div className='absolute w-full block h-[20vh] pointer-events-none' />
          </DialogPrimitive.Content>
        </div>
      </DialogOverlay>
    </DialogPortal>
  );
});
DialogContent.displayName = DialogPrimitive.Content.displayName;

const Modal: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClose: () => void;
}> = ({ children, onClose, className }) => {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    console.log(onClose());
    console.log('closing');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className={className} onClose={onClose}>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export { Dialog, DialogContent, Modal };
