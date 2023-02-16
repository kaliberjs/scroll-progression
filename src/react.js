import React from 'react'

import { onScrollProgression } from './core'

export function useScrollProgression({
  start, 
  end, 
  clamp = true,
  onChange
}) {
  const [node, setNode] = React.useState(null)
  const onChangeRef = React.useRef(null)
  onChangeRef.current = onChange

  const stableStart = useStableObject(start)
  const stableEnd = useStableObject(end)

  React.useEffect(
    () => {
      if (!node) return
      
      return onScrollProgression({
        element: node, 
        start: stableStart, 
        end: stableEnd, 
        clamp,
        onChange(...args) { onChangeRef.current(...args) }
      })
    },
    [node, stableStart, stableEnd, clamp]
  )

  return setNode
}

function useStableObject(object) {
  const objectRef = React.useRef(object)
  
  if (!isDeepCopy(object, objectRef.current)) {
    objectRef.current = object 
  }

  return objectRef.current
}

function isDeepCopy(source, target) {
  if(typeof source !== typeof target) return false
  
  if(Array.isArray(source) && Array.isArray(target)){
    if(source.length !== target.length) return false
    return source.every((value, index) => isDeepCopy(value, target[index]))
  }
  
  if(typeof source === 'object' && typeof target === 'object') {
    return Object.keys(source).every((key) => isDeepCopy(source[key], target[key]))
  }
  
  return source === target
}
