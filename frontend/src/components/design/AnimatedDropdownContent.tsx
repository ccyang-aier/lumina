"use client"

import * as React from "react"
import { DropdownMenuContent } from "@/components/ui/dropdown-menu"
import { motion, Variants } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnimatedDropdownContentProps extends React.ComponentPropsWithoutRef<typeof DropdownMenuContent> {
  // Animation duration configuration
  animationDuration?: number
  // Stagger delay between items
  staggerDelay?: number
  // Disable automatic wrapping of children with motion.div
  disableChildrenAnimation?: boolean
}

// Item variants: Handles the slide-in effect for content
// Exported so consumers can use it when disableChildrenAnimation is true
export const dropdownItemVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    transition: { type: "tween", ease: "easeOut" }
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "tween", ease: "easeOut" }
  },
  exit: { 
    opacity: 0, 
    y: 10,
    transition: { type: "tween", ease: "easeIn" }
  }
}

const AnimatedDropdownContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuContent>,
  AnimatedDropdownContentProps
>(({ className, children, animationDuration = 0.4, staggerDelay = 0.04, disableChildrenAnimation = false, ...props }, ref) => {
  
  // Container variants: Handles the clip-path expansion
  const containerVariants: Variants = {
    hidden: {
      clipPath: "inset(10% 50% 90% 50% round 10px)",
      opacity: 0,
      transition: {
        type: "tween",
        ease: "circOut",
        duration: animationDuration * 0.75
      }
    },
    visible: {
      clipPath: "inset(0% 0% 0% 0% round 10px)",
      opacity: 1,
      transition: {
        type: "tween",
        ease: "circOut",
        duration: animationDuration,
        when: "beforeChildren", // Wait for container to start opening before showing children
        staggerChildren: staggerDelay // Stagger effect for children
      }
    },
    exit: {
      clipPath: "inset(10% 50% 90% 50% round 10px)",
      opacity: 0,
      transition: {
        type: "tween",
        ease: "circIn",
        duration: animationDuration * 0.75,
        when: "afterChildren", // Wait for children to hide before closing container
        staggerChildren: staggerDelay * 0.6,
        staggerDirection: -1
      }
    }
  }

  // Update item variants duration based on props
  const currentItemVariants = {
    ...dropdownItemVariants,
    hidden: { ...dropdownItemVariants.hidden, transition: { ...dropdownItemVariants.hidden.transition, duration: animationDuration * 0.75 } },
    visible: { ...dropdownItemVariants.visible, transition: { ...dropdownItemVariants.visible.transition, duration: animationDuration * 0.75 } },
    exit: { ...dropdownItemVariants.exit, transition: { ...dropdownItemVariants.exit.transition, duration: animationDuration * 0.5 } }
  }

  // Helper function to recursively traverse and wrap children
  // This is a bit of a hack to apply animation to arbitrary children without forcing the user to use specific components
  // In a production app, it might be cleaner to export a specific AnimatedItem component
  const renderChildren = (nodes: React.ReactNode): React.ReactNode => {
    if (disableChildrenAnimation) return nodes;

    return React.Children.map(nodes, (child, index) => {
      if (!React.isValidElement(child)) return child;

      // If it's a fragment, we need to dig deeper
      if (child.type === React.Fragment) {
        return renderChildren(child.props.children);
      }

      // Wrap direct children in motion.div to apply item animations
      // We key by index to ensure stable identity for animations
      return (
        <motion.div variants={currentItemVariants} className="w-full">
          {child}
        </motion.div>
      );
    });
  };

  return (
    <DropdownMenuContent
      ref={ref}
      className={cn(
        // Disable default entry animation so framer motion handles it
        "data-[state=open]:animate-none",
        // Ensure container is transparent and borderless so inner motion div handles styling and clipping
        "bg-transparent border-0 shadow-none p-0 overflow-visible", 
        className
      )}
      {...props}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="w-full h-full overflow-hidden bg-popover text-popover-foreground shadow-xl border rounded-md"
      >
        <div className="p-1 flex flex-col h-full">
          {renderChildren(children)}
        </div>
      </motion.div>
    </DropdownMenuContent>
  )
})

AnimatedDropdownContent.displayName = "AnimatedDropdownContent"

export { AnimatedDropdownContent }
