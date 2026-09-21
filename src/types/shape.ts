export type ToolType = 'move' | 'rect' | 'ellipse'

export type ShapeType = 'rect' | 'ellipse'

export interface Point {
  x: number
  y: number
}

export interface Shape {
  id: string
  type: ShapeType
  x: number
  y: number
  width: number
  height: number
  fill: string
}

export interface Viewport {
  x: number
  y: number
  zoom: number
}
