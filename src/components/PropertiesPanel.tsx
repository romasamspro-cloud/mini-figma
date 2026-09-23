import type { Shape } from '../types/shape'

interface PropertiesPanelProps {
  selectedShape: Shape | null
  onChangeFill: (fill: string) => void
}

const SWATCHES = [
  '#38bdf8',
  '#f87171',
  '#fbbf24',
  '#4ade80',
  '#a78bfa',
  '#f472b6',
  '#334155',
  '#ffffff',
]

export function PropertiesPanel({
  selectedShape,
  onChangeFill,
}: PropertiesPanelProps) {
  return (
    <div className="flex-1 rounded-2xl bg-white/90 p-3 shadow-lg ring-1 ring-black/5 backdrop-blur">
      <h2 className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        Properties
      </h2>
      {selectedShape ? (
        <div className="mt-3">
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={selectedShape.fill}
              onChange={event => onChangeFill(event.target.value)}
              className="h-8 w-8 cursor-pointer rounded-md border border-slate-200 bg-transparent"
            />
            <span className="font-mono text-xs text-slate-600">
              {selectedShape.fill.toUpperCase()}
            </span>
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {SWATCHES.map(color => (
              <button
                key={color}
                type="button"
                onClick={() => onChangeFill(color)}
                style={{ backgroundColor: color }}
                className={`h-7 w-full cursor-pointer rounded-md ring-1 ring-black/10 ${
                  selectedShape.fill === color
                    ? 'outline outline-2 outline-sky-500'
                    : ''
                }`}
              />
            ))}
          </div>
        </div>
      ) : (
        <p className="mt-3 text-xs leading-relaxed text-slate-400">
          Select a shape to edit its properties.
        </p>
      )}
    </div>
  )
}
