import type { FoodEntry, SymptomEntry, SymptomType } from '~/types'

export interface FoodSymptomCorrelation {
  foodName: string
  symptomType: SymptomType
  count: number
  severity: number // average severity
  confidence: number // 0-100 percentage
  recentOccurrences: Array<{
    date: string
    time: string
    severity: number
  }>
}

export interface FoodStats {
  name: string
  totalEntries: number
  symptomCount: number
  symptomRate: number // percentage of times followed by symptoms
  avgTimeBetween: number // average hours between food and symptom
}

export const useFoodAnalysis = () => {
  const { foodEntries, symptomEntries } = useFoodDiary()

  // Time window in hours to consider symptoms related to food
  const SYMPTOM_WINDOW_HOURS = 6

  const getDateTime = (date: string, time: string): Date => {
    return new Date(`${date}T${time}:00`)
  }

  const getHoursDifference = (date1: Date, date2: Date): number => {
    return Math.abs(date2.getTime() - date1.getTime()) / (1000 * 60 * 60)
  }

  // Find correlations between food and symptoms
  const findCorrelations = computed((): FoodSymptomCorrelation[] => {
    const correlations: Record<string, FoodSymptomCorrelation> = {}

    // For each symptom, find foods eaten within the time window before it
    symptomEntries.value.forEach(symptom => {
      const symptomDateTime = getDateTime(symptom.date, symptom.time)

      // Check all food entries
      foodEntries.value.forEach(food => {
        const foodDateTime = getDateTime(food.date, food.time)
        const hoursDiff = getHoursDifference(foodDateTime, symptomDateTime)

        // If food was eaten before symptom and within time window
        if (foodDateTime < symptomDateTime && hoursDiff <= SYMPTOM_WINDOW_HOURS) {
          const key = `${food.name.toLowerCase()}_${symptom.type}`

          if (!correlations[key]) {
            correlations[key] = {
              foodName: food.name,
              symptomType: symptom.type,
              count: 0,
              severity: 0,
              confidence: 0,
              recentOccurrences: []
            }
          }

          correlations[key].count++
          correlations[key].severity += symptom.severity
          correlations[key].recentOccurrences.push({
            date: symptom.date,
            time: symptom.time,
            severity: symptom.severity
          })
        }
      })

      // Also check manually linked foods
      if (symptom.relatedFoods && symptom.relatedFoods.length > 0) {
        symptom.relatedFoods.forEach(foodId => {
          const food = foodEntries.value.find(f => f.id === foodId)
          if (food) {
            const key = `${food.name.toLowerCase()}_${symptom.type}`

            if (!correlations[key]) {
              correlations[key] = {
                foodName: food.name,
                symptomType: symptom.type,
                count: 0,
                severity: 0,
                confidence: 0,
                recentOccurrences: []
              }
            }

            correlations[key].count++
            correlations[key].severity += symptom.severity
            correlations[key].recentOccurrences.push({
              date: symptom.date,
              time: symptom.time,
              severity: symptom.severity
            })
          }
        })
      }
    })

    // Calculate averages and confidence scores
    const result = Object.values(correlations).map(corr => {
      const avgSeverity = corr.severity / corr.count

      // Count how many times this food was consumed
      const foodOccurrences = foodEntries.value.filter(
        f => f.name.toLowerCase() === corr.foodName.toLowerCase()
      ).length

      // Confidence = (times food caused symptom / times food was eaten) * 100
      const confidence = Math.min(100, (corr.count / foodOccurrences) * 100)

      // Sort occurrences by date/time descending (most recent first)
      const sortedOccurrences = corr.recentOccurrences
        .sort((a, b) => {
          const dateTimeA = `${a.date} ${a.time}`
          const dateTimeB = `${b.date} ${b.time}`
          return dateTimeB.localeCompare(dateTimeA)
        })
        .slice(0, 5) // Keep only last 5

      return {
        ...corr,
        severity: Math.round(avgSeverity * 10) / 10,
        confidence: Math.round(confidence),
        recentOccurrences: sortedOccurrences
      }
    })

    // Sort by confidence and count
    return result.sort((a, b) => {
      if (b.confidence !== a.confidence) {
        return b.confidence - a.confidence
      }
      return b.count - a.count
    })
  })

  // Get top trigger foods
  const topTriggers = computed(() => {
    return findCorrelations.value
      .filter(c => c.count >= 2 && c.confidence >= 30)
      .slice(0, 10)
  })

  // Get food statistics
  const foodStats = computed((): FoodStats[] => {
    const stats: Record<string, FoodStats> = {}

    foodEntries.value.forEach(food => {
      const key = food.name.toLowerCase()

      if (!stats[key]) {
        stats[key] = {
          name: food.name,
          totalEntries: 0,
          symptomCount: 0,
          symptomRate: 0,
          avgTimeBetween: 0
        }
      }

      stats[key].totalEntries++

      // Check if symptoms occurred after this food
      const foodDateTime = getDateTime(food.date, food.time)
      let totalHoursDiff = 0
      let symptomCount = 0

      symptomEntries.value.forEach(symptom => {
        const symptomDateTime = getDateTime(symptom.date, symptom.time)
        const hoursDiff = getHoursDifference(foodDateTime, symptomDateTime)

        if (foodDateTime < symptomDateTime && hoursDiff <= SYMPTOM_WINDOW_HOURS) {
          symptomCount++
          totalHoursDiff += hoursDiff
        }
      })

      stats[key].symptomCount += symptomCount
      if (symptomCount > 0) {
        stats[key].avgTimeBetween = totalHoursDiff / symptomCount
      }
    })

    return Object.values(stats).map(stat => ({
      ...stat,
      symptomRate: Math.round((stat.symptomCount / stat.totalEntries) * 100),
      avgTimeBetween: Math.round(stat.avgTimeBetween * 10) / 10
    }))
    .sort((a, b) => b.symptomRate - a.symptomRate)
  })

  // Get safe foods (foods that never caused symptoms)
  const safeFoods = computed(() => {
    return foodStats.value.filter(f => f.symptomRate === 0 && f.totalEntries >= 2)
  })

  // Get risky foods (high symptom rate)
  const riskyFoods = computed(() => {
    return foodStats.value.filter(f => f.symptomRate >= 50 && f.totalEntries >= 2)
  })

  // Get symptom frequency by type
  const symptomFrequency = computed(() => {
    const freq: Record<SymptomType, { count: number; avgSeverity: number }> = {
      putimas: { count: 0, avgSeverity: 0 },
      skausmas: { count: 0, avgSeverity: 0 },
      pykinimas: { count: 0, avgSeverity: 0 },
      kita: { count: 0, avgSeverity: 0 }
    }

    symptomEntries.value.forEach(symptom => {
      freq[symptom.type].count++
      freq[symptom.type].avgSeverity += symptom.severity
    })

    Object.keys(freq).forEach(key => {
      const type = key as SymptomType
      if (freq[type].count > 0) {
        freq[type].avgSeverity = Math.round((freq[type].avgSeverity / freq[type].count) * 10) / 10
      }
    })

    return freq
  })

  return {
    findCorrelations,
    topTriggers,
    foodStats,
    safeFoods,
    riskyFoods,
    symptomFrequency
  }
}
