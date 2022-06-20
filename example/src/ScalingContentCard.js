import { animated, useSpring } from 'react-spring'
import { lerp } from '@kaliber/math'
import { useScrollProgression, triggers }  from '@kaliber/scroll-progression'
import styles from './ScalingContentCard.css'

export function ScalingContentCard({ src, title, children }) {
  const [style, spring] = useSpring(() => ({ 
    scale: 0.75,
    config: { tension: 500, friction: 35 }
  }))

  const trackedElementRef = useScrollProgression({
    start: { element: triggers.top(), scrollParent: triggers.bottom() },
    end: { element: triggers.top(), scrollParent: triggers.custom(0.25) },
    onChange(progression) {
      spring.start({ scale: lerp({ start: 0.75, end: 1, input: easeOut(progression) }) })
    }
  })

  return (
    <section className={styles.component} ref={trackedElementRef}>
      <header className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
        <animated.img className={styles.image} {...{ src, style }} />
      </header>

      <div className={styles.content}>
        {children}
      </div>
    </section>
  )
}

function easeOut(x) {
  return Math.sin((x * Math.PI) / 2)
}
