import { useCallback, useRef, useState } from 'react'
import { createShapeFromRect, rectFromPoints, translateShape } from '../utils/geometry'
import type { Point, Shape, ShapeType } from '../types/shape'

const MIN_SIZE = 2
const GROUP_TIMEOUT = 500

interface DragState {
  id: string
  origin: Point
  start: Point
  moved: boolean
}

interface HistoryMeta {
  group: string | null
  time: number
}

export function useShapes() {
  const [shapes, setShapes] = useState<Shape[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [draftShape, setDraftShape] = useState<Shape | null>(null)
  const [history, setHistory] = useState({ past: 0, future: 0 })

  const shapesRef = useRef<Shape[]>([])
  const selectedIdRef = useRef<string | null>(null)
  const draftShapeRef = useRef<Shape | null>(null)
  const draftStartRef = useRef<Point | null>(null)
  const dragRef = useRef<DragState | null>(null)
  const pastRef = useRef<Shape[][]>([])
  const futureRef = useRef<Shape[][]>([])
  const lastHistoryRef = useRef<HistoryMeta | null>(null)

  const syncHistory = useCallback(() => {
    setHistory({ past: pastRef.current.length, future: futureRef.current.length })
  }, [])

  const record = useCallback(
    (group?: string) => {
      const prev = shapesRef.current
      const now = Date.now()
      const last = lastHistoryRef.current
      if (group && last?.group === group && now - last.time < GROUP_TIMEOUT) {
        lastHistoryRef.current = { group, time: now }
        return
      }
      pastRef.current = [...pastRef.current, prev]
      futureRef.current = []
      lastHistoryRef.current = { group: group ?? null, time: now }
      syncHistory()
    },
    [syncHistory],
  )

  const apply = useCallback(
    (mutate: (current: Shape[]) => Shape[], group?: string) => {
      const next = mutate(shapesRef.current)
      if (next === shapesRef.current) return
      record(group)
      shapesRef.current = next
      setShapes(next)
    },
    [record],
  )

  const updateSelection = useCallback((id: string | null) => {
    selectedIdRef.current = id
    setSelectedId(id)
  }, [])

  const startDrawing = useCallback(
    (type: ShapeType, point: Point) => {
      updateSelection(null)
      draftStartRef.current = point
      draftShapeRef.current = createShapeFromRect(crypto.randomUUID(), type, {
        ...point,
        width: 0,
        height: 0,
      })
      setDraftShape(draftShapeRef.current)
    },
    [updateSelection],
  )

  const extendDrawing = useCallback((point: Point) => {
    const start = draftStartRef.current
    const draft = draftShapeRef.current
    if (!start || !draft) return
    draftShapeRef.current = { ...draft, ...rectFromPoints(start, point) }
    setDraftShape(draftShapeRef.current)
  }, [])

  const commitDrawing = useCallback(() => {
    const draft = draftShapeRef.current
    draftShapeRef.current = null
    draftStartRef.current = null
    setDraftShape(null)
    if (draft && draft.width >= MIN_SIZE && draft.height >= MIN_SIZE) {
      apply(current => [...current, draft])
      updateSelection(draft.id)
    }
  }, [apply, updateSelection])

  const cancelDrawing = useCallback(() => {
    draftShapeRef.current = null
    draftStartRef.current = null
    setDraftShape(null)
  }, [])

  const startDragging = useCallback((id: string, point: Point) => {
    const shape = shapesRef.current.find(item => item.id === id)
    if (shape) {
      dragRef.current = {
        id,
        origin: { x: shape.x, y: shape.y },
        start: point,
        moved: false,
      }
    }
  }, [])

  const dragShape = useCallback(
    (point: Point) => {
      const drag = dragRef.current
      if (!drag) return
      const dx = point.x - drag.start.x
      const dy = point.y - drag.start.y
      if (!drag.moved && (dx !== 0 || dy !== 0)) {
        drag.moved = true
        record()
      }
      shapesRef.current = shapesRef.current.map(shape =>
        shape.id === drag.id
          ? translateShape({ ...shape, x: drag.origin.x, y: drag.origin.y }, dx, dy)
          : shape,
      )
      setShapes(shapesRef.current)
    },
    [record],
  )

  const stopDragging = useCallback(() => {
    dragRef.current = null
  }, [])

  const addShape = useCallback(
    (shape: Shape) => {
      apply(current => [shape, ...current])
    },
    [apply],
  )

  const updateShape = useCallback(
    (id: string, patch: Partial<Shape>) => {
      let changed = false
      apply(
        current => {
          const next = current.map(shape => {
            if (shape.id !== id) return shape
            changed = true
            return { ...shape, ...patch }
          })
          return changed ? next : current
        },
        `update:${id}`,
      )
    },
    [apply],
  )

  const removeShape = useCallback(
    (id: string) => {
      apply(current => current.filter(shape => shape.id !== id))
      if (selectedIdRef.current === id) updateSelection(null)
    },
    [apply, updateSelection],
  )

  const selectShape = useCallback(
    (id: string | null) => {
      updateSelection(id)
    },
    [updateSelection],
  )

  const undo = useCallback(() => {
    const past = pastRef.current
    if (!past.length) return
    const prev = past[past.length - 1]
    pastRef.current = past.slice(0, -1)
    futureRef.current = [shapesRef.current, ...futureRef.current]
    lastHistoryRef.current = null
    shapesRef.current = prev
    setShapes(prev)
    const selected = selectedIdRef.current
    if (selected && !prev.some(shape => shape.id === selected)) {
      updateSelection(null)
    }
    syncHistory()
  }, [syncHistory, updateSelection])

  const redo = useCallback(() => {
    const [next, ...rest] = futureRef.current
    if (!next) return
    pastRef.current = [...pastRef.current, shapesRef.current]
    futureRef.current = rest
    lastHistoryRef.current = null
    shapesRef.current = next
    setShapes(next)
    const selected = selectedIdRef.current
    if (selected && !next.some(shape => shape.id === selected)) {
      updateSelection(null)
    }
    syncHistory()
  }, [syncHistory, updateSelection])

  return {
    shapes,
    selectedId,
    draftShape,
    addShape,
    updateShape,
    removeShape,
    selectShape,
    startDrawing,
    extendDrawing,
    commitDrawing,
    cancelDrawing,
    startDragging,
    dragShape,
    stopMovingShape: stopDragging,
    undo,
    redo,
    canUndo: history.past > 0,
    canRedo: history.future > 0,
  }
}
