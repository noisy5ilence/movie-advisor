'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { AnimatePresence, motion, useDragControls } from 'framer-motion';
import { GripHorizontal } from 'lucide-react';

import { cn } from '@/lib/utils';

const Dialog = DialogPrimitive.Root;

const DialogPortal = ({ ...props }: DialogPrimitive.DialogPortalProps) => <DialogPrimitive.Portal {...props} />;
DialogPortal.displayName = DialogPrimitive.Portal.displayName;

const transition = { duration: 0.35, type: 'spring', bounce: 0 };

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay ref={ref} {...props}>
    <motion.div
      onScroll={props.onScroll}
      className={cn('fixed inset-0 z-50 transform-gpu backdrop-brightness-50 select-none', className)}
      transition={transition}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {props?.children}
    </motion.div>
  </DialogPrimitive.Overlay>
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & { onClose?: () => void }
>(({ className, children, ...props }, ref) => {
  const controls = useDragControls();
  return (
    <DialogPortal>
      <DialogOverlay className='overflow-auto flex justify-center select-none'>
        <motion.div
          className='absolute top-[20vh] max-w-[1000px] w-[calc(100%-24px)] select-none'
          transition={transition}
          initial={{ top: '100vh' }}
          animate={{ top: '20vh' }}
          exit={{ top: '100vh' }}
          drag='y'
          dragConstraints={{ top: 0, bottom: 300 }}
          onDragEnd={(_, info) => info.offset.y > 100 && props.onClose?.()}
          dragListener={false}
          dragControls={controls}
          dragElastic={0.5}
        >
          <DialogPrimitive.Content
            ref={ref}
            className={cn('gap-4 border bg-background p-6 shadow-lg rounded-xl relative', className)}
            {...props}
          >
            <motion.div
              className='w-full h-10 flex p-2 justify-center cursor-grab absolute top-[-36px] z-10'
              onPointerDown={(e) => controls.start(e)}
            >
              <GripHorizontal color='white' />
            </motion.div>
            {children}
            <div className='absolute w-full block h-[20vh] pointer-events-none' />
          </DialogPrimitive.Content>
        </motion.div>
      </DialogOverlay>
    </DialogPortal>
  );
});
DialogContent.displayName = DialogPrimitive.Content.displayName;

const Modal: React.FC<{
  children: React.ReactNode;
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}> = ({ children, onClose, isOpen, className }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog defaultOpen={true} onOpenChange={onClose}>
          <DialogContent forceMount className={className} onClose={onClose}>
            {children}
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export { Dialog, DialogContent, Modal };
