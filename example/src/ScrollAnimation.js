import { useSpring } from 'react-spring'
import { useScrollProgression, constants }  from '@kaliber/scroll-progression'
import { Arc } from '/Arc'
import styles from './ScrollAnimation.css'

export function ScrollAnimation({ layoutClassName = undefined }) {
  const [{ x }, spring] = useSpring(() => ({ 
    x: 0,
    config: { tension: 500, friction: 35, clamp: true }
  }))

  const { ref } = useScrollProgression({
    start: { element: constants.bottom, container: constants.bottom },
    end: { element: constants.top, container: constants.top },
    onChange(progression) {
      spring.start({ to: easeInOut(progression) * 360 })
    }
  })

  return (
    <div className={cx(styles.component, layoutClassName)}>
      <div {...{ ref }} className={styles.container}>
        <Arc radius={100} thickness={25} from={0} to={x} />
      </div>
    </div>
  )
}

function easeInOut(x) {
  return -(Math.cos(Math.PI * x) - 1) / 2
}
