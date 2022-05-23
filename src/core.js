import { unlerp } from '@kaliber/math'

function calculateScrollProgression({ element, container, start, end, clamp = true }) {
  const scrollPosition = container === window ? window.scrollY : container.scrollTop
  return unlerp({
    start: calculatePosition({ element, container, position: start }),
    end: calculatePosition({ element, container, position: end }),
    clamp,
    input: scrollPosition
  })
}

function calculatePosition({ element, container, position }) {
  const containerHeight = container === window ? window.innerHeight : container.offsetHeight
  return (
    element.offsetTop + position.element * element.offsetHeight - 
    containerHeight * position.container
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

  handleScroll()
  container.addEventListener('scroll', handleScroll)
  return () => { container.removeEventListener('scroll', handleScroll) }

  // TODO: add resize listener
  // TODO: add resize observer

  function handleScroll() {
    onChange(calculateScrollProgression({ element, container, start, end, clamp }))
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
