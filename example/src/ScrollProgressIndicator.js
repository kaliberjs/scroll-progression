import { animated, useSpring, config } from 'react-spring'
import { useScrollProgression, constants }  from '@kaliber/scroll-progression'
import styles from './ScrollProgressIndicator.css'

export function ScrollProgressIndicator({ children }) {
  const [style, spring] = useSpring(() => ({ 
    scaleX: 0,
    config: config.molasses
  }))

  const { ref } = useScrollProgression({
    start: { element: constants.top, container: constants.top },
    end: { element: constants.bottom, container: constants.bottom },
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
