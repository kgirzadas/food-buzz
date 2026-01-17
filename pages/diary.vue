<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto">
        <div class="mb-6">
          <NuxtLink to="/" class="text-indigo-600 hover:text-indigo-800 flex items-center gap-2">
            ← Atgal į pradžią
          </NuxtLink>
        </div>

        <div class="mb-6">
          <h1 class="text-3xl font-bold mb-4">📖 Maisto Dienoraštis</h1>

          <UCard>
            <div class="flex flex-wrap gap-4">
              <UFormGroup label="Nuo datos" class="flex-1 min-w-[200px]">
                <UInput v-model="dateRange.start" type="date" />
              </UFormGroup>
              <UFormGroup label="Iki datos" class="flex-1 min-w-[200px]">
                <UInput v-model="dateRange.end" type="date" />
              </UFormGroup>
              <div class="flex items-end">
                <UButton @click="resetDateRange" color="gray" variant="outline">
                  Rodyti viską
                </UButton>
              </div>
            </div>
          </UCard>
        </div>

        <div v-if="filteredEntries.length === 0" class="text-center py-12">
          <p class="text-gray-500 text-lg">Nėra įrašų pasirinktam laikotarpiui</p>
          <div class="mt-4 flex gap-3 justify-center">
            <UButton to="/food" color="primary">Pridėti maisto įrašą</UButton>
            <UButton to="/symptoms" color="primary" variant="outline">Pridėti simptomą</UButton>
          </div>
        </div>

        <div v-else class="space-y-6">
          <div v-for="group in groupedEntries" :key="group.date">
            <h2 class="text-xl font-semibold mb-3 text-gray-800">
              {{ formatDate(group.date) }}
            </h2>

            <div class="space-y-3">
              <div v-for="entry in group.entries" :key="entry.id">
                <UCard v-if="entry.type === 'food'" class="border-l-4 border-indigo-500">
                  <div class="flex gap-3">
                    <div class="text-2xl">🍽️</div>
                    <div class="flex-1">
                      <div class="flex justify-between items-start">
                        <div>
                          <h3 class="font-semibold">{{ entry.data.name }}</h3>
                          <p class="text-sm text-gray-600">{{ entry.data.time }}</p>
                          <p v-if="entry.data.quantity" class="text-sm text-gray-700 mt-1">
                            {{ entry.data.quantity }}
                          </p>
                          <p v-if="entry.data.notes" class="text-sm text-gray-600 mt-2">
                            {{ entry.data.notes }}
                          </p>
                        </div>
                        <UButton
                          icon="i-heroicons-trash"
                          color="red"
                          variant="ghost"
                          size="sm"
                          @click="deleteFoodEntry(entry.id)"
                        />
                      </div>
                    </div>
                  </div>
                </UCard>

                <UCard v-else class="border-l-4 border-red-500">
                  <div class="flex gap-3">
                    <div class="text-2xl">🩺</div>
                    <div class="flex-1">
                      <div class="flex justify-between items-start">
                        <div>
                          <div class="flex items-center gap-2">
                            <h3 class="font-semibold">{{ getSymptomLabel(entry.data.type) }}</h3>
                            <span class="text-sm px-2 py-1 bg-red-100 text-red-800 rounded">
                              {{ entry.data.severity }}/5
                            </span>
                          </div>
                          <p class="text-sm text-gray-600">{{ entry.data.time }}</p>
                          <p v-if="entry.data.notes" class="text-sm text-gray-600 mt-2">
                            {{ entry.data.notes }}
                          </p>
                          <div v-if="entry.data.relatedFoods && entry.data.relatedFoods.length > 0" class="mt-2">
                            <p class="text-xs text-gray-500">Galimi ryšiai su:</p>
                            <ul class="text-sm text-gray-600 list-disc list-inside">
                              <li v-for="foodId in entry.data.relatedFoods" :key="foodId">
                                {{ getFoodName(foodId) }}
                              </li>
                            </ul>
                          </div>
                        </div>
                        <UButton
                          icon="i-heroicons-trash"
                          color="red"
                          variant="ghost"
                          size="sm"
                          @click="deleteSymptomEntry(entry.id)"
                        />
                      </div>
                    </div>
                  </div>
                </UCard>
              </div>
            </div>
          </div>
        </div>

        <div v-if="filteredEntries.length > 0" class="mt-8 text-center text-sm text-gray-500">
          Iš viso: {{ foodCount }} maisto įrašų, {{ symptomCount }} simptomų
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SymptomType, FoodEntry, SymptomEntry } from '~/types'

const { foodEntries, symptomEntries, deleteFoodEntry, deleteSymptomEntry, loadData } = useFoodDiary()

const symptomTypes = [
  { label: '🫧 Putimas', value: 'putimas' },
  { label: '😣 Skausmas', value: 'skausmas' },
  { label: '🤢 Pykinimas', value: 'pykinimas' },
  { label: '❓ Kita', value: 'kita' }
]

const dateRange = ref({
  start: '',
  end: ''
})

const resetDateRange = () => {
  dateRange.value = { start: '', end: '' }
}

const filteredEntries = computed(() => {
  let food = [...foodEntries.value]
  let symptoms = [...symptomEntries.value]

  if (dateRange.value.start) {
    food = food.filter(e => e.date >= dateRange.value.start)
    symptoms = symptoms.filter(e => e.date >= dateRange.value.start)
  }

  if (dateRange.value.end) {
    food = food.filter(e => e.date <= dateRange.value.end)
    symptoms = symptoms.filter(e => e.date <= dateRange.value.end)
  }

  const combined = [
    ...food.map(f => ({ id: f.id, date: f.date, time: f.time, type: 'food' as const, data: f })),
    ...symptoms.map(s => ({ id: s.id, date: s.date, time: s.time, type: 'symptom' as const, data: s }))
  ]

  return combined.sort((a, b) => {
    const dateTimeA = `${a.date} ${a.time}`
    const dateTimeB = `${b.date} ${b.time}`
    return dateTimeB.localeCompare(dateTimeA)
  })
})

const groupedEntries = computed(() => {
  const groups: Record<string, any[]> = {}

  filteredEntries.value.forEach(entry => {
    if (!groups[entry.date]) {
      groups[entry.date] = []
    }
    groups[entry.date].push(entry)
  })

  return Object.keys(groups)
    .sort((a, b) => b.localeCompare(a))
    .map(date => ({
      date,
      entries: groups[date].sort((a, b) => b.time.localeCompare(a.time))
    }))
})

const foodCount = computed(() => {
  return filteredEntries.value.filter(e => e.type === 'food').length
})

const symptomCount = computed(() => {
  return filteredEntries.value.filter(e => e.type === 'symptom').length
})

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr + 'T12:00:00')
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const dateOnly = dateStr
  const todayStr = today.toISOString().split('T')[0]
  const yesterdayStr = yesterday.toISOString().split('T')[0]

  if (dateOnly === todayStr) return 'Šiandien'
  if (dateOnly === yesterdayStr) return 'Vakar'

  const weekdays = ['Sekmadienis', 'Pirmadienis', 'Antradienis', 'Trečiadienis', 'Ketvirtadienis', 'Penktadienis', 'Šeštadienis']
  const months = ['Sausio', 'Vasario', 'Kovo', 'Balandžio', 'Gegužės', 'Birželio', 'Liepos', 'Rugpjūčio', 'Rugsėjo', 'Spalio', 'Lapkričio', 'Gruodžio']

  return `${weekdays[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`
}

const getSymptomLabel = (type: SymptomType) => {
  return symptomTypes.find(t => t.value === type)?.label || type
}

const getFoodName = (foodId: string) => {
  return foodEntries.value.find(f => f.id === foodId)?.name || 'Nežinomas produktas'
}

onMounted(() => {
  loadData()
})
</script>
