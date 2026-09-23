import type { ToolType } from '../types/shape'

export interface ToolDefinition {
  id: ToolType
  label: string
  hotkey: string | null
  code: string | null
}

export const TOOLS: ToolDefinition[] = [
  { id: 'move', label: 'Move', hotkey: 'V', code: 'KeyV' },
  { id: 'rect', label: 'Rect', hotkey: 'R', code: 'KeyR' },
  { id: 'ellipse', label: 'Ellipse', hotkey: 'O', code: 'KeyO' },
]

export const TOOL_BY_CODE: Record<string, ToolType> = Object.fromEntries(
  TOOLS.filter(
    (tool): tool is ToolDefinition & { code: string } => tool.code !== null,
  ).map(tool => [tool.code, tool.id]),
)
