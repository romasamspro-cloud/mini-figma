import { useCallback, useState } from 'react'
import { Canvas } from './components/Canvas'
import { LayersPanel } from './components/LayersPanel'
import { PropertiesPanel } from './components/PropertiesPanel'
import { Toolbar } from './components/Toolbar'
import { useHotkeys } from './hooks/useHotkeys'
import { useShapes } from './hooks/useShapes'
import { useViewport } from './hooks/useViewport'
import { TOOL_BY_CODE } from './constants/tools'
import type { ToolType } from './types/shape'

export default function App() {
  const { viewport, isSpacePressed, panBy, zoomAt } = useViewport()
  const {
    shapes,
    selectedId,
    draftShape,
    updateShape,
    removeShape,
    selectShape,
    startDrawing,
    extendDrawing,
    commitDrawing,
    cancelDrawing,
    startDragging,
    dragShape,
    stopMovingShape,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useShapes()
  const [activeTool, setActiveTool] = useState<ToolType>('move')

  const handleHotkey = useCallback(
    (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey) {
        if (event.code === 'KeyZ') {
          event.preventDefault()
          if (event.shiftKey) {
            redo()
          } else {
            undo()
          }
        }
        return
      }
      if (event.altKey) return

      const tool = TOOL_BY_CODE[event.code]
      if (tool) {
        event.preventDefault()
        setActiveTool(tool)
        return
      }

      if (event.key === 'Escape') {
        event.preventDefault()
        cancelDrawing()
        selectShape(null)
        return
      }

      if ((event.key === 'Delete' || event.key === 'Backspace') && selectedId) {
        event.preventDefault()
        removeShape(selectedId)
      }
    },
    [cancelDrawing, redo, removeShape, selectShape, selectedId, undo],
  )

  useHotkeys(handleHotkey)

  const selectedShape = shapes.find(shape => shape.id === selectedId) ?? null

  return (
    <main className="fixed inset-0 select-none overflow-hidden bg-neutral-100">
      <Canvas
        viewport={viewport}
        isSpacePressed={isSpacePressed}
        panBy={panBy}
        zoomAt={zoomAt}
        shapes={shapes}
        draftShape={draftShape}
        selectedId={selectedId}
        activeTool={activeTool}
        selectShape={selectShape}
        startDrawing={startDrawing}
        extendDrawing={extendDrawing}
        commitDrawing={commitDrawing}
        startDragging={startDragging}
        dragShape={dragShape}
        stopMovingShape={stopMovingShape}
      />
      <Toolbar
        activeTool={activeTool}
        onSelectTool={setActiveTool}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
      />
      <div className="absolute inset-y-0 right-4 flex w-56 flex-col gap-3 py-4">
        <PropertiesPanel
          selectedShape={selectedShape}
          onChangeFill={fill =>
            selectedShape && updateShape(selectedShape.id, { fill })
          }
        />
        <LayersPanel
          shapes={shapes}
          selectedId={selectedId}
          onSelectShape={selectShape}
          onRemoveShape={removeShape}
        />
      </div>
    </main>
  )
}
