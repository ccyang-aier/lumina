"use client";

import { useRef, useEffect } from "react";
import styles from "./AiAgentBall.module.css";

interface AiAgentBallProps {
  /** Total size of the rounded-square ball in pixels */
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

/**
 * Colourful AI agent "face" ball.
 * - Card tilts globally toward the mouse cursor from anywhere on screen.
 * - Eyes follow (look toward) the mouse cursor position.
 * - Happy face on hover via CSS.
 */
export function AiAgentBall({ size = 192, className, style, onClick }: AiAgentBallProps) {
  const referenceSize = 192; // 12rem * 16px
  const scale = size / referenceSize;

  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const eye1Ref = useRef<HTMLSpanElement>(null);
  const eye2Ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Max visual eye travel in pixels (screen space)
    const MAX_EYE_PX = 5;
    // Max tilt angle in degrees
    const MAX_TILT_DEG = 15;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || !cardRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Normalised direction vector (-1 to 1)
      const nx = dist > 0 ? dx / dist : 0;
      const ny = dist > 0 ? dy / dist : 0;

      // Card tilt: always faces toward the mouse, full angle
      // rotateX: mouse above → top leans forward (+), mouse below → top leans back (-)
      // rotateY: mouse left → left leans back (-), mouse right → right leans forward (+)
      const rotateX = -ny * MAX_TILT_DEG;
      const rotateY = nx * MAX_TILT_DEG;

      cardRef.current.style.transition = "transform 0.12s ease-out";
      cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(50px)`;

      // Eye tracking: translate eyes toward the mouse direction.
      // Distance factor: ramp from 0 (center) to 1 (at 1.5x ball radius), then cap.
      const eyeFactor = Math.min(1, dist / (rect.width * 0.75));
      // Convert visual pixels → reference coordinate pixels (pre-scale space)
      const eyeX = (nx * MAX_EYE_PX * eyeFactor) / scale;
      const eyeY = (ny * MAX_EYE_PX * eyeFactor) / scale;
      const eyeTransform = `translate(${eyeX}px, ${eyeY}px)`;

      if (eye1Ref.current) eye1Ref.current.style.transform = eyeTransform;
      if (eye2Ref.current) eye2Ref.current.style.transform = eyeTransform;
    };

    const handleDocMouseLeave = () => {
      if (!cardRef.current) return;
      // Smoothly return to neutral
      cardRef.current.style.transition = "transform 0.6s ease";
      cardRef.current.style.transform =
        "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(50px)";
      const neutral = "translate(0px, 0px)";
      if (eye1Ref.current) eye1Ref.current.style.transform = neutral;
      if (eye2Ref.current) eye2Ref.current.style.transform = neutral;
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleDocMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleDocMouseLeave);
    };
  }, [scale]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        width: size,
        height: size,
        position: "relative",
        ...style,
      }}
      onClick={onClick}
    >
      <div
        style={{
          width: referenceSize,
          height: referenceSize,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        <div className={styles["container-ai-input"]}>
          <div className={styles["container-wrap"]}>
            <div
              ref={cardRef}
              className={styles.card}
              style={{
                transform:
                  "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(50px)",
                transition: "transform 0.6s ease",
              }}
            >
              <div className={styles["background-blur-balls"]}>
                <div className={styles.balls}>
                  <span className={`${styles.ball} ${styles.rosa}`} />
                  <span className={`${styles.ball} ${styles.violet}`} />
                  <span className={`${styles.ball} ${styles.green}`} />
                  <span className={`${styles.ball} ${styles.cyan}`} />
                </div>
              </div>
              <div className={styles["content-card"]}>
                <div className={styles["background-blur-card"]}>
                  <div className={styles.eyes}>
                    <span ref={eye1Ref} className={styles.eye} />
                    <span ref={eye2Ref} className={styles.eye} />
                  </div>
                  <div className={`${styles.eyes} ${styles.happy}`}>
                    <svg fill="none" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M8.28386 16.2843C8.9917 15.7665 9.8765 14.731 12 14.731C14.1235 14.731 15.0083 15.7665 15.7161 16.2843C17.8397 17.8376 18.7542 16.4845 18.9014 15.7665C19.4323 13.1777 17.6627 11.1066 17.3088 10.5888C16.3844 9.23666 14.1235 8 12 8C9.87648 8 7.61556 9.23666 6.69122 10.5888C6.33728 11.1066 4.56771 13.1777 5.09858 15.7665C5.24582 16.4845 6.16034 17.8376 8.28386 16.2843Z"
                      />
                    </svg>
                    <svg fill="none" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M8.28386 16.2843C8.9917 15.7665 9.8765 14.731 12 14.731C14.1235 14.731 15.0083 15.7665 15.7161 16.2843C17.8397 17.8376 18.7542 16.4845 18.9014 15.7665C19.4323 13.1777 17.6627 11.1066 17.3088 10.5888C16.3844 9.23666 14.1235 8 12 8C9.87648 8 7.61556 9.23666 6.69122 10.5888C6.33728 11.1066 4.56771 13.1777 5.09858 15.7665C5.24582 16.4845 6.16034 17.8376 8.28386 16.2843Z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
