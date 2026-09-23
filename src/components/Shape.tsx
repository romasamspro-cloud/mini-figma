import type { MouseEvent as ReactMouseEvent } from 'react'
import type { Shape as ShapeModel } from '../types/shape'

interface ShapeProps {
  shape: ShapeModel
  selected: boolean
  onSelect?: (event: ReactMouseEvent) => void
}

const HANDLES: Array<{
  id: string
  className: string
  cursor: string
}> = [
  { id: 'nw', className: 'left-0 top-0 -translate-x-1/2 -translate-y-1/2', cursor: 'nwse-resize' },
  { id: 'n', className: 'left-1/2 top-0 -translate-x-1/2 -translate-y-1/2', cursor: 'ns-resize' },
  { id: 'ne', className: 'left-full top-0 -translate-x-1/2 -translate-y-1/2', cursor: 'nesw-resize' },
  { id: 'e', className: 'left-full top-1/2 -translate-x-1/2 -translate-y-1/2', cursor: 'ew-resize' },
  { id: 'se', className: 'left-full top-full -translate-x-1/2 -translate-y-1/2', cursor: 'nwse-resize' },
  { id: 's', className: 'left-1/2 top-full -translate-x-1/2 -translate-y-1/2', cursor: 'ns-resize' },
  { id: 'sw', className: 'left-0 top-full -translate-x-1/2 -translate-y-1/2', cursor: 'nesw-resize' },
  { id: 'w', className: 'left-0 top-1/2 -translate-x-1/2 -translate-y-1/2', cursor: 'ew-resize' },
]

export function Shape({ shape, selected, onSelect }: ShapeProps) {
  return (
    <div
      className={`absolute ${selected ? 'cursor-move' : ''}`}
      style={{
        left: shape.x,
        top: shape.y,
        width: shape.width,
        height: shape.height,
      }}
      onMouseDown={onSelect}
    >
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          backgroundColor: shape.fill,
          borderRadius: shape.type === 'ellipse' ? '9999px' : '0px',
        }}
      />
      {selected ? (
        <>
          <div className="pointer-events-none absolute -inset-px border-2 border-sky-500" />
          {HANDLES.map(handle => (
            <div
              key={handle.id}
              className={`pointer-events-none absolute h-2 w-2 rounded-[2px] border border-sky-500 bg-white ${handle.className}`}
              style={{ cursor: handle.cursor }}
            />
          ))}
        </>
      ) : null}
    </div>
  )
}
