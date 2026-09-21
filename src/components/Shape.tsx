import type { Shape as ShapeModel } from '../types/shape'

interface ShapeProps {
  shape: ShapeModel
  selected: boolean
}

export function Shape({ shape, selected }: ShapeProps) {
  return (
    <div
      className={`absolute overflow-hidden ${selected ? 'outline outline-2 -outline-offset-1 outline-sky-500' : ''}`}
      style={{
        left: shape.x,
        top: shape.y,
        width: shape.width,
        height: shape.height,
        backgroundColor: shape.fill,
        borderRadius: shape.type === 'ellipse' ? '9999px' : '0px',
      }}
    />
  )
}
