import { Canvas } from './components/Canvas'
import { LayersPanel } from './components/LayersPanel'
import { PropertiesPanel } from './components/PropertiesPanel'
import { Toolbar } from './components/Toolbar'
import { useHotkeys } from './hooks/useHotkeys'
import { useShapes } from './hooks/useShapes'
import { useViewport } from './hooks/useViewport'

export default function App() {
  const { viewport, isSpacePressed, panBy, zoomAt } = useViewport()
  const { shapes, selectedId, selectShape } = useShapes()
  useHotkeys(() => {})

  return (
    <main className="fixed inset-0 select-none overflow-hidden bg-neutral-100">
      <Canvas
        viewport={viewport}
        isSpacePressed={isSpacePressed}
        panBy={panBy}
        zoomAt={zoomAt}
        shapes={shapes}
        selectedId={selectedId}
        selectShape={selectShape}
      />
      <Toolbar />
      <div className="absolute inset-y-0 right-4 flex w-56 flex-col gap-3 py-4">
        <PropertiesPanel />
        <LayersPanel />
      </div>
    </main>
  )
}
