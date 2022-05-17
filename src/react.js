import { onScrollProgressionChange } from './core'

export function useScrollProgressionChange({
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
      
      return onScrollProgressionChange({
        element: node, 
        start, 
        end, 
        clamp,
        onChange(...args) { onChangeRef.current && onChangeRef.current(...args) }
      })
    },
    [node, start, end, clamp]
  )

  return { ref: setNode }
}
