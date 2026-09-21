import { useCallback, useEffect, useState } from 'react'
import { clampZoom, screenToCanvas } from '../utils/geometry'
import type { Point, Viewport } from '../types/shape'

const isTypingTarget = (target: EventTarget | null) =>
  target instanceof HTMLInputElement ||
  target instanceof HTMLTextAreaElement ||
  target instanceof HTMLSelectElement

export function useViewport() {
  const [viewport, setViewport] = useState<Viewport>({ x: 0, y: 0, zoom: 1 })
  const [isSpacePressed, setIsSpacePressed] = useState(false)

  useEffect(() => {
    setViewport({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      zoom: 1,
    })
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) return
      if (event.code === 'Space') {
        event.preventDefault()
        setIsSpacePressed(true)
      }
    }

    const onKeyUp = (event: KeyboardEvent) => {
      if (event.code === 'Space') setIsSpacePressed(false)
    }

    const onBlur = () => setIsSpacePressed(false)

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('blur', onBlur)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', onBlur)
    }
  }, [])

  const panBy = useCallback((dx: number, dy: number) => {
    setViewport(current => ({
      ...current,
      x: current.x + dx,
      y: current.y + dy,
    }))
  }, [])

  const zoomAt = useCallback((point: Point, factor: number) => {
    setViewport(current => {
      const zoom = clampZoom(current.zoom * factor)
      const canvasPoint = screenToCanvas(point, current)
      return {
        zoom,
        x: point.x - canvasPoint.x * zoom,
        y: point.y - canvasPoint.y * zoom,
      }
    })
  }, [])

  return { viewport, isSpacePressed, panBy, zoomAt }
}
