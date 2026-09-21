import { TOOLS } from '../constants/tools'

export function Toolbar() {
  return (
    <div className="absolute left-4 top-1/2 flex -translate-y-1/2 flex-col gap-1 rounded-2xl bg-white/90 p-1.5 shadow-lg ring-1 ring-black/5 backdrop-blur">
      {TOOLS.map(tool => (
        <button
          key={tool.id}
          type="button"
          className="flex h-11 w-14 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-xl text-[11px] font-medium text-slate-600 hover:bg-slate-100"
        >
          <span>{tool.label}</span>
          <span className="text-[9px] uppercase text-slate-400">
            {tool.hotkey}
          </span>
        </button>
      ))}
    </div>
  )
}
