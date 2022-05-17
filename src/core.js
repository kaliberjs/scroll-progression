import { unlerp } from '@kaliber/math'

// scrollProgression({ 
//   element,
//   start: { element: 0, container: 0 }
//   end: { element: 1, container: 0 }
//   scrollPosition
// })

// scrollProgression({ 
//   element,
//   start: { element: constants.top, container: constants.bottom }
//   end: { element: constants.top, container: constants.top },
//   scrollPosition
// })

function scrollProgression({ element, start, end, scrollPosition, clamp = true }) {
  return unlerp({
    start: calculatePosition({ element, position: start }),
    end: calculatePosition({ element, position: end }),
    clamp,
    input: scrollPosition
  })
}

function calculatePosition({ element, position }) {
  const container = element.offsetParent ?? window
  return (
    element.offsetTop + position.element * element.offsetHeight - 
    container.offsetHeight * position.container
  )
}

export function onScrollProgressionChange({
  element, 
  start, 
  end, 
  clamp = true,
  onChange
}) {
  const container = element.offsetParent ?? window

  if (process.env.NODE_ENV !== 'production') warnIfNotScrollable(container)

  container.addEventListener('scroll', handleScroll)
  return () => { container.removeEventListener('scroll', handleScroll) }

  function handleScroll() {
    const progression = scrollProgression({ element, start, end, clamp, scrollPosition: container.scrollTop })
    onChange(progression)
  }
}

function warnIfNotScrollable(element) {
  if (element.offsetParent.scrollHeight === element.offsetParent.offsetHeight) {
    console.warn('It seems the offsetParent of this element isn\'t scrollable. This is probably a mistake, since nothing will be animated in this case.')
  }
}
