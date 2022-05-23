import { animated, useSpring } from 'react-spring'
import { lerp } from '@kaliber/math'
import { useScrollProgression, constants as c }  from '@kaliber/scroll-progression'
import styles from './Parallax.css'

export function Parallax({ src, distance, layoutClassName = undefined }) {
  const [style, spring] = useSpring(() => ({ 
    y: -distance,
    config: { tension: 500, friction: 35 }
  }))

  const { ref } = useScrollProgression({
    start: { element: c.top, container: c.bottom },
    end: { element: c.bottom, container: c.top },
    onChange(progression) {
      spring.start({ y: lerp({ start: -distance, end: distance, input: progression }) })
    }
  })

  return (
    <div className={cx(styles.component, layoutClassName)} {...{ ref }}>
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
