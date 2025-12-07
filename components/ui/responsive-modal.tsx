"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import * as React from "react";

const ResponsiveModalContext = React.createContext<{ isMobile: boolean }>({
  isMobile: false,
});

const useResponsiveModal = () => {
  const context = React.useContext(ResponsiveModalContext);
  if (!context) {
    throw new Error(
      "ResponsiveModal components must be used within ResponsiveModal"
    );
  }
  return context;
};

interface ResponsiveModalProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {}

const ResponsiveModal = ({ children, ...props }: ResponsiveModalProps) => {
  const isMobile = useIsMobile();
  const Component = isMobile ? Drawer : Dialog;

  return (
    <ResponsiveModalContext.Provider value={{ isMobile }}>
      <Component {...props}>{children}</Component>
    </ResponsiveModalContext.Provider>
  );
};

const ResponsiveModalTrigger = React.forwardRef<
  React.ComponentRef<typeof DialogTrigger>,
  React.ComponentPropsWithoutRef<typeof DialogTrigger>
>(function ResponsiveModalTrigger({ className, children, ...props }, ref) {
  const { isMobile } = useResponsiveModal();
  const Component = isMobile ? DrawerTrigger : DialogTrigger;

  return (
    <Component ref={ref} className={className} {...props}>
      {children}
    </Component>
  );
});

const ResponsiveModalClose = React.forwardRef<
  React.ComponentRef<typeof DialogClose>,
  React.ComponentPropsWithoutRef<typeof DialogClose>
>(function ResponsiveModalClose({ className, children, ...props }, ref) {
  const { isMobile } = useResponsiveModal();
  const Component = isMobile ? DrawerClose : DialogClose;

  return (
    <Component ref={ref} className={className} {...props}>
      {children}
    </Component>
  );
});

const ResponsiveModalContent = React.forwardRef<
  React.ComponentRef<typeof DialogContent>,
  React.ComponentPropsWithoutRef<typeof DialogContent>
>(function ResponsiveModalContent({ className, children, ...props }, ref) {
  const { isMobile } = useResponsiveModal();
  const Component = isMobile ? DrawerContent : DialogContent;

  return (
    <Component ref={ref} className={className} {...props}>
      {children}
    </Component>
  );
});

const ResponsiveModalDescription = React.forwardRef<
  React.ComponentRef<typeof DialogDescription>,
  React.ComponentPropsWithoutRef<typeof DialogDescription>
>(function ResponsiveModalDescription({ className, children, ...props }, ref) {
  const { isMobile } = useResponsiveModal();
  const Component = isMobile ? DrawerDescription : DialogDescription;

  return (
    <Component ref={ref} className={className} {...props}>
      {children}
    </Component>
  );
});

const ResponsiveModalHeader = React.forwardRef<
  React.ComponentRef<typeof DialogHeader>,
  React.ComponentPropsWithoutRef<typeof DialogHeader>
>(function ResponsiveModalHeader({ className, children, ...props }, ref) {
  const { isMobile } = useResponsiveModal();
  const Component = isMobile ? DrawerHeader : DialogHeader;

  return (
    <Component ref={ref} className={className} {...props}>
      {children}
    </Component>
  );
});

const ResponsiveModalTitle = React.forwardRef<
  React.ComponentRef<typeof DialogTitle>,
  React.ComponentPropsWithoutRef<typeof DialogTitle>
>(function ResponsiveModalTitle({ className, children, ...props }, ref) {
  const { isMobile } = useResponsiveModal();
  const Component = isMobile ? DrawerTitle : DialogTitle;

  return (
    <Component ref={ref} className={className} {...props}>
      {children}
    </Component>
  );
});

const ResponsiveModalBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function ResponsiveModalBody({ className, children, ...props }, ref) {
  return (
    <div ref={ref} className={cn("px-4 md:px-0", className)} {...props}>
      {children}
    </div>
  );
});

const ResponsiveModalFooter = React.forwardRef<
  React.ComponentRef<typeof DialogFooter>,
  React.ComponentPropsWithoutRef<typeof DialogFooter>
>(function ResponsiveModalFooter({ className, children, ...props }, ref) {
  const { isMobile } = useResponsiveModal();
  const Component = isMobile ? DrawerFooter : DialogFooter;

  return (
    <Component ref={ref} className={className} {...props}>
      {children}
    </Component>
  );
});

export {
  ResponsiveModal,
  ResponsiveModalBody,
  ResponsiveModalClose,
  ResponsiveModalContent,
  ResponsiveModalDescription,
  ResponsiveModalFooter,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
  ResponsiveModalTrigger,
};
