"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"

// Individual Star Particle
export const FallingStar = ({ id, onComplete }: { id: number, onComplete: (id: number) => void }) => {
  const stars = ["✨"];
  const randomStar = stars[Math.floor(Math.random() * stars.length)];
  const randomX = Math.random() * 40 - 20; // Random X offset between -20px and 20px
  
  return (
    <motion.div
      initial={{ y: -10, opacity: 0, scale: 0.5, x: randomX }}
      animate={{ 
        y: [0, 40], 
        opacity: [0, 1, 1, 0],
        scale: [0.5, 1.2, 1],
        rotate: [0, Math.random() * 180 - 90] 
      }}
      transition={{ 
        duration: 1.5, 
        ease: "easeOut",
        times: [0, 0.2, 0.8, 1]
      }}
      onAnimationComplete={() => onComplete(id)}
      className="absolute top-full left-1/2 text-lg pointer-events-none z-50 select-none"
      style={{ marginLeft: "-0.5em" }} // Center horizontally
    >
      {randomStar}
    </motion.div>
  );
};

// Container Component that handles spawning logic
export const FallingStarsEffect = ({ isActive }: { isActive: boolean }) => {
  const [fallingStars, setFallingStars] = React.useState<number[]>([])
  const nextStarId = React.useRef(0)

  const removeStar = (id: number) => {
    setFallingStars(prev => prev.filter(item => item !== id));
  };

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive) {
      // Spawn immediately
      setFallingStars(prev => [...prev, nextStarId.current++]);
      
      // Then spawn periodically
      interval = setInterval(() => {
        setFallingStars(prev => [...prev, nextStarId.current++]);
      }, 800); 
    }
    
    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible">
      <AnimatePresence>
        {fallingStars.map(id => (
          <FallingStar key={id} id={id} onComplete={removeStar} />
        ))}
      </AnimatePresence>
    </div>
  );
};
