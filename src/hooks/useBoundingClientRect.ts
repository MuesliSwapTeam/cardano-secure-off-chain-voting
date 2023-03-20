import { useEffect, useRef, useState } from 'react'

const DEFAULT_RECT: Omit<DOMRect, 'toJSON'> = {
  x: 0,
  y: 0,
  height: 0,
  width: 0,
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
}
/* get element bounding client rect */
export default function useBoundingClientRect<E extends Element = Element>() {
  const [element, elementRef] = useState<E | null>(null)
  const [rect, setRect] = useState(DEFAULT_RECT)
  const observerRef = useRef(
    new ResizeObserver(([{ target }]) => {
      if (!target) return
      const { x, y, height, width, top, right, bottom, left } = target.getBoundingClientRect()

      setRect({ x, y, height, width, top, right, bottom, left })
    }),
  )

  useEffect(() => {
    if (!element) return undefined
    const { current } = observerRef

    current.observe(element)

    return () => current.disconnect()
  }, [element])

  return [elementRef, rect] as const
}
