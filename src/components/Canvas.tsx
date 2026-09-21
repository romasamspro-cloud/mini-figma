import { useEffect, useRef, useState } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'
import { Shape as ShapeView } from './Shape'
import type { Point, Shape, Viewport } from '../types/shape'

const GRID_SIZE = 24

interface CanvasProps {
  viewport: Viewport
  isSpacePressed: boolean
  panBy: (dx: number, dy: number) => void
  zoomAt: (point: Point, factor: number) => void
  shapes: Shape[]
  selectedId: string | null
  selectShape: (id: string | null) => void
}

export function Canvas({
  viewport,
  isSpacePressed,
  panBy,
  zoomAt,
  shapes,
  selectedId,
  selectShape,
}: CanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const dragStartRef = useRef<Point | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    const element = containerRef.current
    if (!element) return

    const onWheel = (event: WheelEvent) => {
      event.preventDefault()
      if (event.ctrlKey) {
        zoomAt(
          { x: event.clientX, y: event.clientY },
          Math.exp(-event.deltaY * 0.01),
        )
      } else {
        panBy(-event.deltaX, -event.deltaY)
      }
    }

    element.addEventListener('wheel', onWheel, { passive: false })
    return () => element.removeEventListener('wheel', onWheel)
  }, [panBy, zoomAt])

  const handleMouseDown = (event: ReactMouseEvent) => {
    if (isSpacePressed) {
      dragStartRef.current = { x: event.clientX, y: event.clientY }
      setIsDragging(true)
    } else {
      selectShape(null)
    }
  }

  const handleMouseMove = (event: ReactMouseEvent) => {
    const start = dragStartRef.current
    if (!start) return
    panBy(event.clientX - start.x, event.clientY - start.y)
    dragStartRef.current = { x: event.clientX, y: event.clientY }
  }

  const stopDragging = () => {
    dragStartRef.current = null
    setIsDragging(false)
  }

  const cursorClass = isDragging
    ? 'cursor-grabbing'
    : isSpacePressed
      ? 'cursor-grab'
      : 'cursor-default'

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden ${cursorClass}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={stopDragging}
      onMouseLeave={stopDragging}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(0, 0, 0, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 0, 0, 0.06) 1px, transparent 1px)',
          backgroundSize: `${GRID_SIZE * viewport.zoom}px ${GRID_SIZE * viewport.zoom}px`,
          backgroundPosition: `${viewport.x}px ${viewport.y}px`,
        }}
      />
      <div
        className="absolute left-0 top-0"
        style={{
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
          transformOrigin: '0 0',
        }}
      >
        {shapes.map(shape => (
          <ShapeView
            key={shape.id}
            shape={shape}
            selected={shape.id === selectedId}
          />
        ))}
      </div>
    </div>
  )
}
