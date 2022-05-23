import { animated, useSpring, config } from 'react-spring'
import { useScrollProgression, constants as c }  from '@kaliber/scroll-progression'
import styles from './ScrollProgressIndicator.css'

export function ScrollProgressIndicator({ children }) {
  const [style, spring] = useSpring(() => ({ 
    scaleX: 0,
    config: config.molasses
  }))

  const { ref } = useScrollProgression({
    start: { element: c.top, container: c.top },
    end: { element: c.bottom, container: c.bottom },
    onChange(progression) {
      spring.start({ scaleX: progression })
    }
  })

  return (
    <div className={styles.component} {...{ ref }}>
      <animated.div className={styles.indicator} {...{ style }} />
      <div>
        {children}
      </div>
    </div>
  )
}
