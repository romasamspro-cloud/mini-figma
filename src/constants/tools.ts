import type { ToolType } from '../types/shape'

export interface ToolDefinition {
  id: ToolType
  label: string
  hotkey: string | null
}

export const TOOLS: ToolDefinition[] = [
  { id: 'move', label: 'Move', hotkey: 'V' },
  { id: 'rect', label: 'Rect', hotkey: 'R' },
  { id: 'ellipse', label: 'Ellipse', hotkey: 'O' },
]

export const TOOL_BY_HOTKEY: Record<string, ToolType> = Object.fromEntries(
  TOOLS.filter(
    (tool): tool is ToolDefinition & { hotkey: string } =>
      tool.hotkey !== null,
  ).map(tool => [tool.hotkey.toLowerCase(), tool.id]),
)
