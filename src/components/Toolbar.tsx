import { TOOLS } from '../constants/tools'
import type { ToolType } from '../types/shape'

interface ToolbarProps {
  activeTool: ToolType
  onSelectTool: (tool: ToolType) => void
  canUndo: boolean
  canRedo: boolean
  onUndo: () => void
  onRedo: () => void
}

export function Toolbar({
  activeTool,
  onSelectTool,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
}: ToolbarProps) {
  return (
    <div className="absolute left-4 top-1/2 flex -translate-y-1/2 flex-col gap-1 rounded-2xl bg-white/90 p-1.5 shadow-lg ring-1 ring-black/5 backdrop-blur">
      <button
        type="button"
        onClick={onUndo}
        disabled={!canUndo}
        title="Undo (Ctrl+Z / Cmd+Z)"
        className={`flex h-9 w-14 cursor-pointer items-center justify-center rounded-xl text-base text-slate-600 ${
          canUndo ? 'hover:bg-slate-100' : 'cursor-default opacity-30'
        }`}
      >
        &#8630;
      </button>
      <button
        type="button"
        onClick={onRedo}
        disabled={!canRedo}
        title="Redo (Ctrl+Shift+Z / Cmd+Shift+Z)"
        className={`flex h-9 w-14 cursor-pointer items-center justify-center rounded-xl text-base text-slate-600 ${
          canRedo ? 'hover:bg-slate-100' : 'cursor-default opacity-30'
        }`}
      >
        &#8631;
      </button>
      <div className="mx-2 h-px bg-slate-200" />
      {TOOLS.map(tool => {
        const isActive = tool.id === activeTool
        return (
          <button
            key={tool.id}
            type="button"
            onClick={() => onSelectTool(tool.id)}
            className={`flex h-11 w-14 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-xl text-[11px] font-medium hover:bg-slate-100 ${
              isActive
                ? 'bg-sky-500/10 text-sky-600 ring-1 ring-sky-500/40'
                : 'text-slate-600'
            }`}
          >
            <span>{tool.label}</span>
            <span className="text-[9px] uppercase text-slate-400">
              {tool.hotkey}
            </span>
          </button>
        )
      })}
    </div>
  )
}
