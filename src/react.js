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

  React.useEffect(
    () => {
      if (!node) return
      
      return onScrollProgression({
        element: node, 
        start, 
        end, 
        clamp,
        onChange(...args) { onChangeRef.current(...args) }
      })
    },
    [node, start, end, clamp]
  )

  return setNode
}
