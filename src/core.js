import { unlerp } from '@kaliber/math'

export function onScrollProgression({ element, start, end, onChange }) {
  const container = getContainer(element)

  handleScrollProgressionChange()
  
  return container.onScrollProgressionChange(handleScrollProgressionChange)

  function handleScrollProgressionChange() {
    onChange(calculateScrollProgression({ element, container, start, end }))
  }
}

function calculateScrollProgression({ element, container, start, end }) {
  const scrollPosition = container.getScrollPosition()
  return unlerp({
    start: calculatePosition({ element, container, position: start, scrollPosition }),
    end: calculatePosition({ element, container, position: end, scrollPosition }),
    clamp: true,
    input: scrollPosition
  })
}

function calculatePosition({ element, container, position, scrollPosition }) {
  const elementRect = element.getBoundingClientRect()
  const containerRect = container.getRect()

  const offsetTop = elementRect.top + scrollPosition - containerRect.top
  const elementPosition = position.element.anchor * elementRect.height + (position.element.offset ?? 0)
  const containerPosition = position.container.anchor * containerRect.height + (position.container.offset ?? 0)

  return offsetTop + elementPosition - containerPosition
}

function getContainer(element) {
  const scrollParent = getScrollParent(element)
  return scrollParent === window ? windowContainer() : elementContainer(scrollParent)
}

function windowContainer() {
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

function elementContainer(element) {
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
