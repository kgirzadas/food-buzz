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

  // Update food entry
  const updateFoodEntry = (id: string, updatedEntry: Omit<FoodEntry, 'id'>) => {
    const index = foodEntries.value.findIndex(e => e.id === id)
    if (index !== -1) {
      foodEntries.value[index] = { ...updatedEntry, id }
      saveData()
    }
  }

  // Update symptom entry
  const updateSymptomEntry = (id: string, updatedEntry: Omit<SymptomEntry, 'id'>) => {
    const index = symptomEntries.value.findIndex(e => e.id === id)
    if (index !== -1) {
      symptomEntries.value[index] = { ...updatedEntry, id }
      saveData()
    }
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
    const year = yesterday.getFullYear()
    const month = String(yesterday.getMonth() + 1).padStart(2, '0')
    const day = String(yesterday.getDate()).padStart(2, '0')
    const yesterdayStr = `${year}-${month}-${day}`

    return foodEntries.value.filter(e => e.date >= yesterdayStr)
  }

  // Get unique food names with frequency count
  const getUniqueFoodNames = () => {
    const foodCounts: Record<string, { name: string; count: number; lastUsed: string }> = {}

    foodEntries.value.forEach(entry => {
      const key = entry.name.toLowerCase()
      if (!foodCounts[key]) {
        foodCounts[key] = {
          name: entry.name,
          count: 0,
          lastUsed: entry.date
        }
      }
      foodCounts[key].count++
      // Keep the most recent date
      if (entry.date > foodCounts[key].lastUsed) {
        foodCounts[key].lastUsed = entry.date
      }
    })

    // Convert to array and sort by frequency (most used first)
    return Object.values(foodCounts).sort((a, b) => b.count - a.count)
  }

  // Get most common foods (top 10)
  const getMostCommonFoods = () => {
    return getUniqueFoodNames().slice(0, 10)
  }

  return {
    foodEntries,
    symptomEntries,
    loadData,
    saveData,
    addFoodEntry,
    addSymptomEntry,
    updateFoodEntry,
    updateSymptomEntry,
    deleteFoodEntry,
    deleteSymptomEntry,
    getEntriesByDateRange,
    getRecentFoodEntries,
    getUniqueFoodNames,
    getMostCommonFoods
  }
}
