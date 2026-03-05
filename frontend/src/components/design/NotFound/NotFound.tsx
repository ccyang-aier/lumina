"use client"

import { useRouter } from "next/navigation"
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button"
import styles from "./NotFound.module.css"

export function NotFound() {
  const router = useRouter()

  return (
    <div className="relative flex w-full flex-1 flex-col items-center justify-center pt-32 pb-32">
      <div className={styles.scene}>
        <div className={`${styles.orb} ${styles["orb--1"]}`} />
        <div className={`${styles.orb} ${styles["orb--2"]}`} />
        <div className={`${styles.orb} ${styles["orb--3"]}`} />
        <div className={`${styles.orb} ${styles["orb--4"]}`} />

        <div className={styles.content}>
          <div className={styles["error-container"]}>
            <div className={styles["error-code"]}>404</div>
            <InteractiveHoverButton
              type="button"
              className="mt-8 cursor-pointer"
              onClick={() => router.push("/")}
            >
              返回首页
            </InteractiveHoverButton>
          </div>

          <div className={styles.duck__wrapper}>
            <div className={styles.duck}>
              <div className={styles.duck__inner}>
                <div className={styles.duck__mouth} />
                <div className={styles.duck__head}>
                  <div className={styles.duck__eye} />
                  <div className={styles.duck__white} />
                </div>
                <div className={styles.duck__body} />
                <div className={styles.duck__wing} />
              </div>
              <div className={`${styles.duck__foot} ${styles["duck__foot--1"]}`} />
              <div className={`${styles.duck__foot} ${styles["duck__foot--2"]}`} />
              <div className={styles.surface} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
