import { animated, useSpring } from 'react-spring'
import { lerp } from '@kaliber/math'
import { useScrollProgression, constants as c }  from '@kaliber/scroll-progression'
import styles from './Clip.css'

export function Clip({ children }) {
  const [{ clip }, spring] = useSpring(() => ({ 
    clip: 0,
    config: { tension: 500, friction: 35 }
  }))

  const { ref } = useScrollProgression({
    start: { element: c.top, container: { anchor: 0.9 } },
    end: { element: c.top, container: { anchor: 0.9, offset: -200 } },
    onChange(progression) {
      spring.start({ clip: easeOut(progression) })
    }
  })

  return (
    <animated.div {...{ ref }} className={styles.component} style={{ opacity: clip }}>
      <animated.div className={styles.clip} style={{
        clipPath: clip.to(x => {
          const edge = lerp({ start: 75, end: 0, input: x })
          return `polygon(${edge}% 0%, 100% 0%, 100% 100%, ${edge}% 100%)`
        })
      }}>
        {children}
      </animated.div>
    </animated.div>
  )
}

function easeOut(x) {
  return Math.sin((x * Math.PI) / 2)
}
