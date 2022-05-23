import { unlerp } from '@kaliber/math'

function calculateScrollProgression({ element, container, start, end }) {
  const scrollPosition = container === window ? window.scrollY : container.scrollTop
  return unlerp({
    start: calculatePosition({ element, container, position: start, scrollPosition }),
    end: calculatePosition({ element, container, position: end, scrollPosition }),
    clamp: true,
    input: scrollPosition
  })
}

function calculatePosition({ element, container, position, scrollPosition }) {
  const elementRect = element.getBoundingClientRect()
  const containerRect = container === window ? getWindowRect() : container.getBoundingClientRect()

  return (
    elementRect.top + scrollPosition - containerRect.top + position.element * elementRect.height - 
    containerRect.height * position.container
  )
}

export function onScrollProgression({
  element, 
  start, 
  end, 
  clamp = true,
  onChange
}) {
  const container = getOverflowContainer(element) ?? window
  if (process.env.NODE_ENV !== 'production') warnIfNotScrollable(container)

  handleScrollProgressionChange()
  
  const observer = new ResizeObserver(handleScrollProgressionChange)

  if (container !== window) {
    observer.observe(container)
  }

  container.addEventListener('scroll', handleScrollProgressionChange)
  container.addEventListener('resize', handleScrollProgressionChange)

  return () => { 
    container.removeEventListener('scroll', handleScrollProgressionChange) 
    container.removeEventListener('resize', handleScrollProgressionChange) 
    observer.disconnect()
  }

  function handleScrollProgressionChange() {
    onChange(calculateScrollProgression({ element, container, start, end }))
  }
}

function warnIfNotScrollable(element) {
  if (element !== window && element.scrollHeight === element.offsetHeight) {
    console.warn('It seems the offsetParent of this element isn\'t scrollable. This is probably a mistake, since nothing will be animated in this case.')
  }
}

function getOverflowContainer(element) {
  const parent = element.parentNode
  if (!(parent instanceof Element)) return null

  const isOverflowContainer = ['overflow', 'overflow-x', 'overflow-y']
    .map(x => getComputedStyle(parent, null)
    .getPropertyValue(x)).some(x => x === 'auto' || x === 'scroll')

  return isOverflowContainer ? parent : getOverflowContainer(parent)
}

function getWindowRect() {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
    left: 0,
    top: 0,
    right: window.innerWidth,
    bottom: window.innerHeight
  }
}
