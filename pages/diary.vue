<template>
  <div class="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto">
        <div class="mb-6">
          <NuxtLink to="/" class="inline-flex items-center gap-2 text-white hover:text-purple-200 transition-colors font-semibold">
            <span class="text-xl">←</span> Atgal į pradžią
          </NuxtLink>
        </div>

        <div class="mb-6">
          <div class="flex items-center gap-3 mb-6">
            <div class="text-6xl">📖</div>
            <h1 class="text-4xl font-bold text-white drop-shadow-lg">Maisto Dienoraštis</h1>
          </div>

          <div class="bg-white rounded-2xl shadow-2xl p-6">
            <div class="space-y-4">
              <UFormGroup label="🔍 Paieška (maisto pavadinimas ar pastabos)">
                <UInput
                  v-model="searchQuery"
                  placeholder="pvz., Sūris, Pienas, skausmas..."
                  icon="i-heroicons-magnifying-glass"
                />
              </UFormGroup>

              <div class="flex flex-wrap gap-4">
                <UFormGroup label="Nuo datos" class="flex-1 min-w-[200px]">
                  <UInput v-model="dateRange.start" type="date" />
                </UFormGroup>
                <UFormGroup label="Iki datos" class="flex-1 min-w-[200px]">
                  <UInput v-model="dateRange.end" type="date" />
                </UFormGroup>
              </div>

              <div class="flex flex-wrap gap-3">
                <UFormGroup label="Filtruoti pagal tipą">
                  <div class="flex gap-2">
                    <button
                      @click="toggleTypeFilter('food')"
                      :class="[
                        'px-4 py-2 rounded-lg font-semibold transition-all',
                        typeFilters.food
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      ]"
                    >
                      🍽️ Maistas
                    </button>
                    <button
                      @click="toggleTypeFilter('symptom')"
                      :class="[
                        'px-4 py-2 rounded-lg font-semibold transition-all',
                        typeFilters.symptom
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      ]"
                    >
                      🩺 Simptomai
                    </button>
                  </div>
                </UFormGroup>

                <UFormGroup label="Simptomų tipas" v-if="typeFilters.symptom">
                  <div class="flex flex-wrap gap-2">
                    <button
                      v-for="symptom in symptomTypes"
                      :key="symptom.value"
                      @click="toggleSymptomFilter(symptom.value)"
                      :class="[
                        'px-3 py-2 rounded-lg text-sm font-semibold transition-all',
                        symptomFilters.includes(symptom.value)
                          ? 'bg-indigo-500 text-white'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      ]"
                    >
                      {{ symptom.label }}
                    </button>
                  </div>
                </UFormGroup>
              </div>

              <div class="flex justify-end">
                <button
                  @click="resetFilters"
                  class="px-4 py-2 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
                >
                  ✕ Išvalyti visus filtrus
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="filteredEntries.length === 0" class="text-center py-16 bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20">
          <p class="text-white text-xl mb-6">Nėra įrašų pasirinktam laikotarpiui</p>
          <div class="flex gap-4 justify-center">
            <NuxtLink to="/food" class="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg">
              Pridėti maisto įrašą
            </NuxtLink>
            <NuxtLink to="/symptoms" class="bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-red-600 hover:to-rose-700 transition-all shadow-lg">
              Pridėti simptomą
            </NuxtLink>
          </div>
        </div>

        <div v-else class="space-y-6">
          <div v-for="group in groupedEntries" :key="group.date">
            <h2 class="text-xl font-semibold mb-3 text-white">
              {{ formatDate(group.date) }}
            </h2>

            <div class="space-y-3">
              <div v-for="entry in group.entries" :key="entry.id">
                <div v-if="entry.type === 'food'" class="border-l-4 border-green-500 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-5">
                  <div class="flex gap-3">
                    <div class="text-2xl">🍽️</div>
                    <div class="flex-1">
                      <div class="flex justify-between items-start">
                        <div>
                          <h3 class="font-semibold text-gray-900">{{ entry.data.name }}</h3>
                          <p class="text-sm text-gray-700">{{ entry.data.time }}</p>
                          <p v-if="entry.data.quantity" class="text-sm text-gray-800 mt-1">
                            {{ entry.data.quantity }}
                          </p>
                          <p v-if="entry.data.notes" class="text-sm text-gray-700 mt-2">
                            {{ entry.data.notes }}
                          </p>
                        </div>
                        <button
                          @click="handleDeleteFoodEntry(entry.id)"
                          class="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all"
                        >
                          <span class="text-xl">🗑️</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-else class="border-l-4 border-red-500 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-5">
                  <div class="flex gap-3">
                    <div class="text-2xl">🩺</div>
                    <div class="flex-1">
                      <div class="flex justify-between items-start">
                        <div>
                          <div class="flex items-center gap-2">
                            <h3 class="font-semibold text-gray-900">{{ getSymptomLabel(entry.data.type) }}</h3>
                            <span class="text-sm px-2 py-1 bg-red-100 text-red-900 rounded font-medium">
                              {{ entry.data.severity }}/5
                            </span>
                          </div>
                          <p class="text-sm text-gray-700">{{ entry.data.time }}</p>
                          <p v-if="entry.data.notes" class="text-sm text-gray-700 mt-2">
                            {{ entry.data.notes }}
                          </p>
                          <div v-if="entry.data.relatedFoods && entry.data.relatedFoods.length > 0" class="mt-2">
                            <p class="text-xs text-gray-700 font-medium">Galimi ryšiai su:</p>
                            <ul class="text-sm text-gray-800 list-disc list-inside">
                              <li v-for="foodId in entry.data.relatedFoods" :key="foodId">
                                {{ getFoodName(foodId) }}
                              </li>
                            </ul>
                          </div>
                        </div>
                        <button
                          @click="handleDeleteSymptomEntry(entry.id)"
                          class="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all"
                        >
                          <span class="text-xl">🗑️</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="filteredEntries.length > 0" class="mt-8 text-center bg-white/10 backdrop-blur-lg rounded-2xl py-4 border border-white/20">
          <p class="text-white font-medium">Iš viso: {{ foodCount }} maisto įrašų, {{ symptomCount }} simptomų</p>
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

const searchQuery = ref('')
const dateRange = ref({
  start: '',
  end: ''
})
const typeFilters = ref({
  food: true,
  symptom: true
})
const symptomFilters = ref<SymptomType[]>([])

const toggleTypeFilter = (type: 'food' | 'symptom') => {
  typeFilters.value[type] = !typeFilters.value[type]
}

const toggleSymptomFilter = (symptom: SymptomType) => {
  const index = symptomFilters.value.indexOf(symptom)
  if (index === -1) {
    symptomFilters.value.push(symptom)
  } else {
    symptomFilters.value.splice(index, 1)
  }
}

const resetFilters = () => {
  searchQuery.value = ''
  dateRange.value = { start: '', end: '' }
  typeFilters.value = { food: true, symptom: true }
  symptomFilters.value = []
}

const filteredEntries = computed(() => {
  let food = [...foodEntries.value]
  let symptoms = [...symptomEntries.value]

  // Apply date range filters
  if (dateRange.value.start) {
    food = food.filter(e => e.date >= dateRange.value.start)
    symptoms = symptoms.filter(e => e.date >= dateRange.value.start)
  }

  if (dateRange.value.end) {
    food = food.filter(e => e.date <= dateRange.value.end)
    symptoms = symptoms.filter(e => e.date <= dateRange.value.end)
  }

  // Apply search query filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    food = food.filter(e =>
      e.name.toLowerCase().includes(query) ||
      (e.notes && e.notes.toLowerCase().includes(query)) ||
      (e.quantity && e.quantity.toLowerCase().includes(query))
    )
    symptoms = symptoms.filter(e =>
      (e.notes && e.notes.toLowerCase().includes(query)) ||
      getSymptomLabel(e.type).toLowerCase().includes(query)
    )
  }

  // Apply symptom type filter
  if (symptomFilters.value.length > 0) {
    symptoms = symptoms.filter(e => symptomFilters.value.includes(e.type))
  }

  // Combine entries based on type filters
  const combined = []
  if (typeFilters.value.food) {
    combined.push(...food.map(f => ({ id: f.id, date: f.date, time: f.time, type: 'food' as const, data: f })))
  }
  if (typeFilters.value.symptom) {
    combined.push(...symptoms.map(s => ({ id: s.id, date: s.date, time: s.time, type: 'symptom' as const, data: s })))
  }

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

// Helper to get local date in YYYY-MM-DD format (not UTC!)
const getLocalDateString = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr + 'T12:00:00')
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const dateOnly = dateStr
  const todayStr = getLocalDateString(today)
  const yesterdayStr = getLocalDateString(yesterday)

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

// Wrapper functions with confirmation dialogs
const handleDeleteFoodEntry = (id: string) => {
  if (confirm('Ar tikrai norite ištrinti šį maisto įrašą?')) {
    deleteFoodEntry(id)
  }
}

const handleDeleteSymptomEntry = (id: string) => {
  if (confirm('Ar tikrai norite ištrinti šį simptomo įrašą?')) {
    deleteSymptomEntry(id)
  }
}

onMounted(() => {
  loadData()
})
</script>
