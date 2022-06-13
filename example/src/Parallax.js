import { animated, useSpring } from 'react-spring'
import { lerp } from '@kaliber/math'
import { useScrollProgression, triggers }  from '@kaliber/scroll-progression'
import styles from './Parallax.css'

export function Parallax({ src, distance, layoutClassName = undefined }) {
  const [style, spring] = useSpring(() => ({ 
    y: -distance,
    config: { tension: 500, friction: 35 }
  }))

  const trackedElementRef = useScrollProgression({
    start: { element: triggers.top(), scrollParent: triggers.bottom() },
    end: { element: triggers.bottom(), scrollParent: triggers.top() },
    onChange(progression) {
      spring.start({ y: lerp({ start: -distance, end: distance, input: progression }) })
    }
  })

  return (
    <div className={cx(styles.component, layoutClassName)} ref={trackedElementRef}>
      <animated.img
        className={styles.image}
        style={{ 
          ...style, 
          height: `calc(100% + ${2 * distance}px)`, 
          inset: -distance + 'px 0' 
        }} 
        {...{ src }} 
      />
    </div>
  )
}
