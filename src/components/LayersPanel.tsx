import type { Shape } from '../types/shape'

interface LayersPanelProps {
  shapes: Shape[]
  selectedId: string | null
  onSelectShape: (id: string) => void
  onRemoveShape: (id: string) => void
}

const TYPE_LABELS: Record<Shape['type'], string> = {
  rect: 'Rectangle',
  ellipse: 'Ellipse',
}

export function LayersPanel({
  shapes,
  selectedId,
  onSelectShape,
  onRemoveShape,
}: LayersPanelProps) {
  return (
    <div className="flex-1 rounded-2xl bg-white/90 p-3 shadow-lg ring-1 ring-black/5 backdrop-blur">
      <h2 className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        Layers
      </h2>
      {shapes.length === 0 ? (
        <p className="mt-3 text-xs leading-relaxed text-slate-400">
          Shapes will appear here.
        </p>
      ) : (
        <ul className="mt-2 flex flex-col gap-0.5">
          {shapes.map(shape => {
            const isSelected = shape.id === selectedId
            return (
              <li key={shape.id}>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelectShape(shape.id)}
                  onKeyDown={event => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      onSelectShape(shape.id)
                    }
                  }}
                  className={`group flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-xs ${
                    isSelected
                      ? 'bg-sky-500/10 text-sky-700 ring-1 ring-sky-500/40'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span
                    className="h-3 w-3 shrink-0 rounded-[3px] ring-1 ring-black/10"
                    style={{ backgroundColor: shape.fill }}
                  />
                  <span className="flex-1 truncate">
                    {TYPE_LABELS[shape.type]}
                  </span>
                  <button
                    type="button"
                    aria-label="Delete layer"
                    onClick={event => {
                      event.stopPropagation()
                      onRemoveShape(shape.id)
                    }}
                    className="hidden h-4 w-4 shrink-0 items-center justify-center rounded text-slate-400 hover:bg-slate-200 hover:text-slate-600 group-hover:flex"
                  >
                    ✕
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
