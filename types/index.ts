export interface FoodEntry {
  id: string
  date: string
  time: string
  name: string
  quantity: string
  notes?: string
}

export interface SymptomEntry {
  id: string
  date: string
  time: string
  type: 'putimas' | 'skausmas' | 'pykinimas' | 'kita'
  severity: 1 | 2 | 3 | 4 | 5
  notes?: string
  relatedFoods?: string[] // IDs of food entries
}

export type SymptomType = SymptomEntry['type']
