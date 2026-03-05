"use client"

import React, {
  ComponentPropsWithoutRef,
  useEffect,
  useMemo,
  useState,
} from "react"
import { AnimatePresence, motion, MotionProps } from "motion/react"

import { cn } from "@/lib/utils"

export function AnimatedListItem({ children }: { children: React.ReactNode }) {
  const animations: MotionProps = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1, originY: 0 },
    exit: { scale: 0, opacity: 0 },
    transition: { type: "spring", stiffness: 350, damping: 40 },
  }

  return (
    <motion.div {...animations} layout className="mx-auto w-full">
      {children}
    </motion.div>
  )
}

export interface AnimatedListProps extends ComponentPropsWithoutRef<"div"> {
  children: React.ReactNode
  delay?: number
}

export const AnimatedList = React.memo(
  ({ children, className, delay = 1000, ...props }: AnimatedListProps) => {
    const [index, setIndex] = useState(0)
    const childrenArray = useMemo(
      () => React.Children.toArray(children),
      [children]
    )

    useEffect(() => {
      const timeout = setTimeout(() => {
        setIndex((prevIndex) => prevIndex + 1);
      }, delay);

      return () => clearTimeout(timeout);
    }, [index, delay]);

    const itemsToShow = useMemo(() => {
      // Loop the list when it reaches the end
      const totalItems = childrenArray.length;
      if (totalItems === 0) return [];
      
      const showCount = Math.min(index + 1, totalItems);
      const result = [];
      
      for (let i = 0; i < showCount; i++) {
        // Calculate index, handling wrap-around for infinite feeling
        const itemIndex = (index - i) % totalItems;
        const normalizedIndex = itemIndex < 0 ? itemIndex + totalItems : itemIndex;
        
        const originalItem = childrenArray[normalizedIndex] as React.ReactElement;
        
        // Use a unique key based on the absolute index to prevent unmounting when cycling
        result.push(
          React.cloneElement(originalItem, {
            key: `${originalItem.key}-${index - i}`
          })
        );
      }
      
      return result;
    }, [index, childrenArray]);

    return (
      <div
        className={cn(`flex flex-col items-center gap-4`, className)}
        {...props}
      >
        <AnimatePresence initial={false}>
          {itemsToShow.map((item) => (
            <AnimatedListItem key={(item as React.ReactElement).key}>
              {item}
            </AnimatedListItem>
          ))}
        </AnimatePresence>
      </div>
    )
  }
)

AnimatedList.displayName = "AnimatedList"
