import { useCallback, useState } from 'react'
import type { Shape } from '../types/shape'

export function useShapes() {
  const [shapes, setShapes] = useState<Shape[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const addShape = useCallback((shape: Shape) => {
    setShapes(current => [...current, shape])
  }, [])

  const updateShape = useCallback((id: string, patch: Partial<Shape>) => {
    setShapes(current =>
      current.map(shape => (shape.id === id ? { ...shape, ...patch } : shape)),
    )
  }, [])

  const removeShape = useCallback((id: string) => {
    setShapes(current => current.filter(shape => shape.id !== id))
  }, [])

  const selectShape = useCallback((id: string | null) => {
    setSelectedId(id)
  }, [])

  return { shapes, selectedId, addShape, updateShape, removeShape, selectShape }
}
