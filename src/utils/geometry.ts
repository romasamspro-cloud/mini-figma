import type { Point, Shape, ShapeType, Viewport } from '../types/shape'

export function rectFromPoints(from: Point, to: Point) {
  return {
    x: Math.min(from.x, to.x),
    y: Math.min(from.y, to.y),
    width: Math.abs(to.x - from.x),
    height: Math.abs(to.y - from.y),
  }
}

export function createShapeFromRect(
  id: string,
  type: ShapeType,
  rect: { x: number; y: number; width: number; height: number },
): Shape {
  return { id, type, ...rect, fill: '#38bdf8' }
}

export const MIN_ZOOM = 0.1
export const MAX_ZOOM = 4

export function clampZoom(zoom: number): number {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom))
}

export function translateShape(shape: Shape, dx: number, dy: number): Shape {
  return { ...shape, x: shape.x + dx, y: shape.y + dy }
}

export function screenToCanvas(point: Point, viewport: Viewport): Point {
  return {
    x: (point.x - viewport.x) / viewport.zoom,
    y: (point.y - viewport.y) / viewport.zoom,
  }
}

export function canvasToScreen(point: Point, viewport: Viewport): Point {
  return {
    x: point.x * viewport.zoom + viewport.x,
    y: point.y * viewport.zoom + viewport.y,
  }
}
