'use client';

import * as React from 'react';
import { CSSProperties, useState } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { DialogContentProps } from '@radix-ui/react-dialog';

import useScrollDelta from '@/hooks/useScrollDelta';
import { cn } from '@/lib/utils';

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 overflow-auto data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className
    )}
    {...props}
  >
    {props?.children}
  </DialogPrimitive.Overlay>
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    onClose?: () => void;
    scrollRef?: React.MutableRefObject<HTMLDivElement>;
    portal?: HTMLElement;
  }
>(({ className, children, onClose, scrollRef, portal, ...props }, ref) => {
  const FULL_OPACITY = 1;

  const position = React.useRef(0);

  const canBeCloseRef = React.useRef(false);

  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const overlayRef = React.useRef<HTMLDivElement>(null) as React.MutableRefObject<HTMLDivElement>;
  const contentRef = React.useRef<HTMLDivElement | null>(null);

  const { delta, onScroll } = useScrollDelta();

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    position.current = event.touches[0].clientY;
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    const SCROLL_OVERFLOW_THRESHOLD = 150;
    const TOP_POSITION = 0;

    const overlay = overlayRef.current;
    const wrapper = wrapperRef.current;

    if (!overlay) return;

    const { clientY } = event.touches[0];

    const scrollOverflow = clientY - position.current;
    const top = overlay.scrollTop;

    const isTop = top === TOP_POSITION;

    const canBeClosed = scrollOverflow > SCROLL_OVERFLOW_THRESHOLD;

    canBeCloseRef.current = canBeClosed && isTop;

    if (isTop && wrapper) {
      wrapper.style.opacity = `${FULL_OPACITY - scrollOverflow / SCROLL_OVERFLOW_THRESHOLD}`;
    }

    if (top <= TOP_POSITION && delta.current < TOP_POSITION && canBeClosed) onClose?.();
  };

  const handleTouchEnd = () => {
    if (canBeCloseRef.current) return onClose?.();

    canBeCloseRef.current = false;

    if (!wrapperRef.current) return;

    wrapperRef.current.style.opacity = `${FULL_OPACITY}`;
  };

  const handleRef = (element: HTMLDivElement | null) => {
    if (!element || !ref) return;

    typeof ref === 'function' ? ref(element) : (ref.current = element);

    contentRef.current = element;
  };

  return (
    <DialogPortal container={portal}>
      <div className='fixed inset-0 z-50 size-full bg-black/80' data-overlay ref={wrapperRef}>
        <DialogOverlay
          ref={(element) => {
            if (!element) return;

            overlayRef.current = element;

            if (scrollRef) {
              scrollRef.current = element;
            }
          }}
          onScroll={onScroll}
        >
          <DialogPrimitive.Content
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            ref={handleRef}
            {...props}
            className={cn(
              'absolute top-[20vh] max-w-[930px] w-[calc(100%-24px)] left-[50%] rounded-xl translate-x-[-50%] gap-4 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=open]:slide-in-from-left-1/2 bg-background',
              className
            )}
          >
            {children}
            <div className='pointer-events-none absolute top-full block h-[20vh] w-10' />
          </DialogPrimitive.Content>
        </DialogOverlay>
      </div>
    </DialogPortal>
  );
});
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)} {...props} />
);
DialogHeader.displayName = 'DialogHeader';

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)} {...props} />
);
DialogFooter.displayName = 'DialogFooter';

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('text-lg font-semibold leading-none tracking-tight', className)}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

const Modal: React.FC<{
  children: React.ReactNode;
  className?: string;
  style?: CSSProperties;
  onClose: () => void;
  scrollRef?: React.MutableRefObject<HTMLDivElement>;
  onInteractOutside?: DialogContentProps['onInteractOutside'];
  onPointerDownOutside?: DialogContentProps['onPointerDownOutside'];
  portal?: HTMLElement;
}> = ({ children, onClose, className, style, scrollRef, onInteractOutside, onPointerDownOutside, portal }) => {
  const [open, setOpen] = useState(true);

  React.useLayoutEffect(() => {
    const viewport = document.querySelector('[name="viewport"]');

    viewport?.setAttribute(
      'content',
      'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
    );
  }, []);

  const handleClose = () => {
    onClose?.();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogHeader>
        <DialogTitle />
      </DialogHeader>
      <DialogContent
        onInteractOutside={onInteractOutside}
        onPointerDownOutside={onPointerDownOutside}
        style={style}
        scrollRef={scrollRef}
        forceMount
        onClose={handleClose}
        className={className}
        portal={portal}
      >
        {children}
        <DialogDescription className='hidden' />
      </DialogContent>
    </Dialog>
  );
};

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  Modal
};
