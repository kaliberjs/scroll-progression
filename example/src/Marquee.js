import { animated, useSpring, config } from 'react-spring'
import { sequence } from '@kaliber/math'
import { useElementSize } from '@kaliber/use-element-size'
import { useScrollProgression, constants }  from '@kaliber/scroll-progression'
import styles from './Marquee.css'

export function MarqueeLtr({ children }) {
  const { ref: scrollProgressionRef, progression } = useAnimatedScrollProgression()
  
  return (
    <div className={styles.componentLtr} ref={scrollProgressionRef}>
      <MarqueeBase className={styles.componentLtr} direction={1} {...{ progression, children }} />
    </div>
  )
}

export function MarqueeRtl({ children }) {
  const { ref: scrollProgressionRef, progression } = useAnimatedScrollProgression()

  return (
    <div className={styles.componentRtl} ref={scrollProgressionRef}>
      <MarqueeBase className={styles.componentRtl} direction={-1} {...{ progression, children }} />
    </div>
  )
}

export function Marquees({ lines }) {
  const { ref: scrollProgressionRef, progression } = useAnimatedScrollProgression()
  
  return (
    <div ref={scrollProgressionRef} className={styles.componentMarquees}>
      {lines.map((line, i) => (
        <MarqueeBase direction={i % 2 === 0 ? 1 : -1} key={i} {...{ progression }}>{line}</MarqueeBase>
      ))}
    </div>
  )
}

function MarqueeBase({ progression, direction, children }) {
  const { ref: itemSizeRef, size: itemSize } = useElementSize()
  const { ref: containerSizeRef, size: containerSize } = useElementSize()

  const repetitions = Math.max(2, itemSize.width ? Math.ceil(containerSize.width * 2 / itemSize.width) : 2)

  return (
    <animated.div 
      className={styles.componentBase} 
      ref={containerSizeRef} 
      style={{
        x: progression.to(x => x * direction * containerSize.width)
      }}
    >
      <div className={styles.items}>
        <div className={styles.item} ref={itemSizeRef}>
          {children}
        </div>

        {sequence(repetitions - 1).map((x) => (
          <div className={styles.item} key={x}>&nbsp;&ndash;&nbsp;{children}</div>
        ))}
      </div>
    </animated.div>
  )
}

function useAnimatedScrollProgression() {
  const [{ progression }, spring] = useSpring(() => ({ progression: 0, config: { tension: 500, friction: 35 } }))
  const { ref } = useScrollProgression({
    start: { element: constants.top, container: constants.bottom },
    end: { element: constants.bottom, container: constants.top },
    onChange(progression) { spring.start({ progression }) }
  })

  return { ref, progression }
}
