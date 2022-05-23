import { ScalingContentCard } from '/ScalingContentCard'
import { Parallax } from '/Parallax'
import { Clip } from '/Clip'
import { Marquees } from '/Marquee'
import { ScrollAnimation } from '/ScrollAnimation'
import { ScrollProgressIndicator } from '/ScrollProgressIndicator'
import imageContentCard from './images/content-card.svg'
import imageParallax from './images/parallax.jpg?max-width=1920'
import imageClip from './images/clip.svg'
import styles from './App.css'

export function App() {
  return (
    <ScrollProgressIndicator>
      <main className={styles.component}>
        <ScalingContentCard 
          src={imageContentCard} 
          title={<>@kaliber/<wbr />scroll&#8209;progression</>}
        >
          <Content>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias porro, natus distinctio similique velit maxime exercitationem debitis cupiditate magnam perspiciatis fugiat? Porro quis blanditiis autem pariatur, ut veniam alias illum!</p>
            <p>Porro quis blanditiis autem pariatur, ut veniam alias illum! Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias porro.</p>
          </Content>
        </ScalingContentCard>

        <Parallax 
          src={imageParallax} 
          distance={150}
          layoutClassName={styles.parallax}
        />

        <Clip>
          <img src={imageClip} />
        </Clip>

        <div className={styles.marquees}>
          <Marquees lines={[
            '@kaliber/scroll-progression',
            'Animate on scroll',
            '@kaliber/scroll-progression',
            'Super flexible!',
          ]} />
        </div>

        <ScrollAnimation layoutClassName={styles.scrollAnimation} />
      </main>
    </ScrollProgressIndicator>
  )
}

function Content({ children }) {
  return (
    <div className={styles.componentContent}>
      {children}
    </div>
  )
}
