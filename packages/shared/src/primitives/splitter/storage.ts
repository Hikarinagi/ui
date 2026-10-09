import type { PanelData, PanelGroupStorage } from './types'

interface SerializedPanelGroupState {
  [panelKey: string]: {
    expandToSizes: Record<string, number>
    layout: number[]
    sizeUnits?: Record<number, 'px'>
  }
}

export function initializeDefaultStorage(storageObject: PanelGroupStorage) {
  try {
    if (typeof localStorage !== 'undefined') {
      storageObject.getItem = (name: string) => {
        return localStorage.getItem(name)
      }
      storageObject.setItem = (name: string, value: string) => {
        localStorage.setItem(name, value)
      }
    } else {
      throw new TypeError('localStorage not supported in this environment')
    }
  } catch (error) {
    console.error(error)
    storageObject.getItem = () => null
    storageObject.setItem = () => {}
  }
}

function getPanelGroupKey(autoSaveId: string): string {
  return `reka:${autoSaveId}`
}

function getPanelKey(panels: PanelData[]): string {
  return panels
    .map(panel => {
      const { constraints, id, idIsFromProps, order } = panel
      if (idIsFromProps) return id
      else return order ? `${order}:${JSON.stringify(constraints)}` : JSON.stringify(constraints)
    })
    .sort((a, b) => a.localeCompare(b))
    .join(',')
}

function loadSerializedPanelGroupState(
  autoSaveId: string,
  storage: PanelGroupStorage,
): SerializedPanelGroupState | null {
  try {
    const panelGroupKey = getPanelGroupKey(autoSaveId)
    const serialized = storage.getItem(panelGroupKey)
    if (serialized) {
      const parsed = JSON.parse(serialized)
      if (typeof parsed === 'object' && parsed != null) return parsed as SerializedPanelGroupState
    }
  } catch {}
  return null
}

export function loadPanelGroupState(
  autoSaveId: string,
  panels: PanelData[],
  storage: PanelGroupStorage,
) {
  const state = loadSerializedPanelGroupState(autoSaveId, storage) ?? {}
  const panelKey = getPanelKey(panels)
  return state[panelKey] ?? null
}

export function savePanelGroupState(
  autoSaveId: string,
  panels: PanelData[],
  panelSizesBeforeCollapse: Map<string, number>,
  sizes: number[],
  storage: PanelGroupStorage,
): void {
  const panelGroupKey = getPanelGroupKey(autoSaveId)
  const panelKey = getPanelKey(panels)
  const state = loadSerializedPanelGroupState(autoSaveId, storage) ?? {}
  const sizeUnits: Record<number, 'px'> = {}
  panels.forEach((panel, index) => {
    const unit = panel.constraints.sizeUnit ?? '%'
    if (unit === 'px') sizeUnits[index] = 'px'
  })
  state[panelKey] = {
    expandToSizes: Object.fromEntries(panelSizesBeforeCollapse.entries()),
    layout: sizes,
    ...(Object.keys(sizeUnits).length > 0 && { sizeUnits }),
  }
  try {
    storage.setItem(panelGroupKey, JSON.stringify(state))
  } catch (error) {
    console.error(error)
  }
}
