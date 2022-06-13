import { unlerp } from '@kaliber/math'

export function onScrollProgression({ element, start, end, onChange }) {
  const scrollParent = getScrollParent(element)

  handleScrollProgressionChange()
  
  return scrollParent.onScrollProgressionChange(handleScrollProgressionChange)

  function handleScrollProgressionChange() {
    onChange(calculateScrollProgression({ element, scrollParent, start, end }))
  }
}

function calculateScrollProgression({ element, scrollParent, start, end }) {
  const scrollPosition = scrollParent.getScrollPosition()
  return unlerp({
    start: calculatePosition({ element, scrollParent, position: start, scrollPosition }),
    end: calculatePosition({ element, scrollParent, position: end, scrollPosition }),
    clamp: true,
    input: scrollPosition
  })
}

function calculatePosition({ element, scrollParent, position, scrollPosition }) {
  const elementRect = element.getBoundingClientRect()
  const scrollParentRect = scrollParent.getRect()

  const offsetTop = elementRect.top + scrollPosition - scrollParentRect.top
  const elementPosition = position.element.anchor * elementRect.height + (position.element.offset ?? 0)
  const scrollParentPosition = position.scrollParent.anchor * scrollParentRect.height + (position.scrollParent.offset ?? 0)

  return offsetTop + elementPosition - scrollParentPosition
}

function getScrollParent(element) {
  const scrollParent = getScrollParent(element)
  return scrollParent === window ? windowScrollParent() : elementScrollParent(scrollParent)
}

function windowScrollParent() {
  return {
    getRect,
    getScrollPosition() { return window.scrollY },
    onScrollProgressionChange
  }

  function getRect() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      left: 0,
      top: 0,
      right: window.innerWidth,
      bottom: window.innerHeight
    }
  }

  function onScrollProgressionChange(fn) {
    window.addEventListener('scroll', fn)
    window.addEventListener('resize', fn)

    return () => {
      window.removeEventListener('scroll', fn) 
      window.removeEventListener('resize', fn) 
    }
  }
}

function elementScrollParent(element) {
  console.log(element)
  return {
    getRect() { return element.getBoundingClientRect() },
    getScrollPosition() { return element.scrollTop },
    onScrollProgressionChange
  }

  function onScrollProgressionChange(fn) {
    const observer = new ResizeObserver(fn)

    observer.observe(element)
    element.addEventListener('scroll', fn)

    return () => {
      element.removeEventListener('scroll', fn) 
      observer.disconnect()
    }
  }
}

function getScrollParent(element) {
  const parent = element.parentNode
  if (!(parent instanceof Element)) return window

  const style = getComputedStyle(parent, null)
  const isScrollParent = ['overflow', 'overflow-y']
    .some(x => ['auto', 'scroll'].includes(style.getPropertyValue(x)))

  return isScrollParent ? parent : getScrollParent(parent)
}
