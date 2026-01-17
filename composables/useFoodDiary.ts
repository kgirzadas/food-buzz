import type { FoodEntry, SymptomEntry } from '~/types'

export const useFoodDiary = () => {
  const foodEntries = useState<FoodEntry[]>('foodEntries', () => [])
  const symptomEntries = useState<SymptomEntry[]>('symptomEntries', () => [])

  // Load data from localStorage
  const loadData = () => {
    if (process.client) {
      const savedFood = localStorage.getItem('foodEntries')
      const savedSymptoms = localStorage.getItem('symptomEntries')

      if (savedFood) {
        foodEntries.value = JSON.parse(savedFood)
      }
      if (savedSymptoms) {
        symptomEntries.value = JSON.parse(savedSymptoms)
      }
    }
  }

  // Save data to localStorage
  const saveData = () => {
    if (process.client) {
      localStorage.setItem('foodEntries', JSON.stringify(foodEntries.value))
      localStorage.setItem('symptomEntries', JSON.stringify(symptomEntries.value))
    }
  }

  // Add food entry
  const addFoodEntry = (entry: Omit<FoodEntry, 'id'>) => {
    const newEntry: FoodEntry = {
      ...entry,
      id: Date.now().toString()
    }
    foodEntries.value.push(newEntry)
    saveData()
  }

  // Add symptom entry
  const addSymptomEntry = (entry: Omit<SymptomEntry, 'id'>) => {
    const newEntry: SymptomEntry = {
      ...entry,
      id: Date.now().toString()
    }
    symptomEntries.value.push(newEntry)
    saveData()
  }

  // Delete food entry
  const deleteFoodEntry = (id: string) => {
    foodEntries.value = foodEntries.value.filter(e => e.id !== id)
    saveData()
  }

  // Delete symptom entry
  const deleteSymptomEntry = (id: string) => {
    symptomEntries.value = symptomEntries.value.filter(e => e.id !== id)
    saveData()
  }

  // Get entries by date range
  const getEntriesByDateRange = (startDate: string, endDate: string) => {
    return {
      food: foodEntries.value.filter(e => e.date >= startDate && e.date <= endDate),
      symptoms: symptomEntries.value.filter(e => e.date >= startDate && e.date <= endDate)
    }
  }

  // Get recent food entries (last 24 hours)
  const getRecentFoodEntries = () => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]

    return foodEntries.value.filter(e => e.date >= yesterdayStr)
  }

  return {
    foodEntries,
    symptomEntries,
    loadData,
    saveData,
    addFoodEntry,
    addSymptomEntry,
    deleteFoodEntry,
    deleteSymptomEntry,
    getEntriesByDateRange,
    getRecentFoodEntries
  }
}
