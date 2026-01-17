<template>
  <div class="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-6xl mx-auto">
        <div class="mb-6">
          <NuxtLink to="/" class="inline-flex items-center gap-2 text-white hover:text-purple-200 transition-colors font-semibold">
            <span class="text-xl">←</span> Atgal į pradžią
          </NuxtLink>
        </div>

        <div class="mb-6">
          <div class="flex items-center gap-3 mb-6">
            <div class="text-6xl">📊</div>
            <h1 class="text-4xl font-bold text-white drop-shadow-lg">Analizė ir Įžvalgos</h1>
          </div>
        </div>

        <div v-if="foodEntries.length === 0 || symptomEntries.length === 0" class="bg-white rounded-3xl shadow-2xl p-8 text-center">
          <p class="text-lg text-gray-700 mb-4">
            Nepakanka duomenų analizei. Pridėkite daugiau maisto įrašų ir simptomų, kad galėtume analizuoti ryšius.
          </p>
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
          <!-- Top Triggers -->
          <div class="bg-white rounded-3xl shadow-2xl p-8">
            <div class="flex items-center gap-3 mb-6">
              <span class="text-4xl">⚠️</span>
              <h2 class="text-2xl font-bold text-gray-900">Galimi Trigeriai</h2>
            </div>

            <div v-if="topTriggers.length === 0" class="text-gray-600">
              <p>Kol kas neaptikta aiškių ryšių tarp maisto ir simptomų.</p>
              <p class="text-sm mt-2">Pridėkite daugiau įrašų arba pažymėkite ryšius tarp simptomų ir maisto.</p>
            </div>

            <div v-else class="space-y-4">
              <div v-for="trigger in topTriggers" :key="`${trigger.foodName}_${trigger.symptomType}`"
                   class="border-l-4 border-red-500 bg-red-50 rounded-lg p-4">
                <div class="flex justify-between items-start mb-2">
                  <div>
                    <h3 class="font-semibold text-lg text-gray-900">{{ trigger.foodName }}</h3>
                    <p class="text-sm text-gray-700">
                      Simptomai: <span class="font-medium">{{ getSymptomLabel(trigger.symptomType) }}</span>
                    </p>
                  </div>
                  <div class="text-right">
                    <div class="text-2xl font-bold text-red-600">{{ trigger.confidence }}%</div>
                    <div class="text-xs text-gray-600">Pasitikėjimas</div>
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-4 text-sm text-gray-700">
                  <div>
                    <span class="font-medium">Kartų:</span> {{ trigger.count }}
                  </div>
                  <div>
                    <span class="font-medium">Vid. intensyvumas:</span> {{ trigger.severity }}/5
                  </div>
                </div>
                <div v-if="trigger.recentOccurrences.length > 0" class="mt-3 pt-3 border-t border-red-200">
                  <p class="text-xs text-gray-600 mb-2">Paskutiniai atvejai:</p>
                  <div class="flex flex-wrap gap-2">
                    <span v-for="(occ, i) in trigger.recentOccurrences" :key="i"
                          class="text-xs bg-white px-2 py-1 rounded border border-red-200">
                      {{ occ.date }} {{ occ.time }} ({{ occ.severity }}/5)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Risky Foods -->
          <div class="bg-white rounded-3xl shadow-2xl p-8">
            <div class="flex items-center gap-3 mb-6">
              <span class="text-4xl">🚫</span>
              <h2 class="text-2xl font-bold text-gray-900">Rizikingiausi Produktai</h2>
            </div>

            <div v-if="riskyFoods.length === 0" class="text-gray-600">
              <p>Nepastebėta produktų, kurie nuolat sukeltų simptomus.</p>
            </div>

            <div v-else class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="border-b border-gray-200">
                    <th class="text-left py-3 px-4 font-semibold text-gray-900">Produktas</th>
                    <th class="text-center py-3 px-4 font-semibold text-gray-900">Kartų valgyta</th>
                    <th class="text-center py-3 px-4 font-semibold text-gray-900">Simptomų dažnis</th>
                    <th class="text-center py-3 px-4 font-semibold text-gray-900">Vid. laikas iki simptomų</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="food in riskyFoods" :key="food.name" class="border-b border-gray-100 hover:bg-gray-50">
                    <td class="py-3 px-4 font-medium text-gray-900">{{ food.name }}</td>
                    <td class="text-center py-3 px-4 text-gray-700">{{ food.totalEntries }}</td>
                    <td class="text-center py-3 px-4">
                      <span class="px-3 py-1 bg-red-100 text-red-800 rounded-full font-semibold">
                        {{ food.symptomRate }}%
                      </span>
                    </td>
                    <td class="text-center py-3 px-4 text-gray-700">
                      {{ food.avgTimeBetween > 0 ? `~${food.avgTimeBetween}h` : '-' }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Safe Foods -->
          <div class="bg-white rounded-3xl shadow-2xl p-8">
            <div class="flex items-center gap-3 mb-6">
              <span class="text-4xl">✅</span>
              <h2 class="text-2xl font-bold text-gray-900">Saugūs Produktai</h2>
            </div>

            <div v-if="safeFoods.length === 0" class="text-gray-600">
              <p>Kol kas nėra produktų, kurie tikrai nesukelia simptomų (reikia bent 2 įrašų).</p>
            </div>

            <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              <div v-for="food in safeFoods" :key="food.name"
                   class="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900">{{ food.name }}</h3>
                <p class="text-sm text-gray-600 mt-1">
                  Valgyta {{ food.totalEntries }} {{ food.totalEntries === 1 ? 'kartą' : 'kartus' }}, simptomų nebuvo
                </p>
              </div>
            </div>
          </div>

          <!-- Symptom Frequency -->
          <div class="bg-white rounded-3xl shadow-2xl p-8">
            <div class="flex items-center gap-3 mb-6">
              <span class="text-4xl">📈</span>
              <h2 class="text-2xl font-bold text-gray-900">Simptomų Dažnumas</h2>
            </div>

            <div class="grid md:grid-cols-2 gap-4">
              <div v-for="(data, type) in symptomFrequency" :key="type"
                   class="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-5 border border-indigo-200">
                <h3 class="font-semibold text-lg text-gray-900 mb-2">
                  {{ getSymptomLabel(type as SymptomType) }}
                </h3>
                <div class="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div class="text-gray-600">Kartų:</div>
                    <div class="text-2xl font-bold text-indigo-600">{{ data.count }}</div>
                  </div>
                  <div>
                    <div class="text-gray-600">Vid. intensyvumas:</div>
                    <div class="text-2xl font-bold text-indigo-600">
                      {{ data.count > 0 ? data.avgSeverity : '-' }}<span v-if="data.count > 0" class="text-base">/5</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Summary Stats -->
          <div class="bg-white rounded-3xl shadow-2xl p-8">
            <div class="flex items-center gap-3 mb-6">
              <span class="text-4xl">📋</span>
              <h2 class="text-2xl font-bold text-gray-900">Bendra Statistika</h2>
            </div>

            <div class="grid md:grid-cols-3 gap-6">
              <div class="text-center">
                <div class="text-4xl font-bold text-green-600">{{ foodEntries.length }}</div>
                <div class="text-gray-600 mt-2">Maisto įrašų</div>
              </div>
              <div class="text-center">
                <div class="text-4xl font-bold text-red-600">{{ symptomEntries.length }}</div>
                <div class="text-gray-600 mt-2">Simptomų</div>
              </div>
              <div class="text-center">
                <div class="text-4xl font-bold text-indigo-600">{{ uniqueFoodCount }}</div>
                <div class="text-gray-600 mt-2">Unikalių produktų</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SymptomType } from '~/types'

const { foodEntries, symptomEntries, loadData } = useFoodDiary()
const { topTriggers, safeFoods, riskyFoods, symptomFrequency } = useFoodAnalysis()

const symptomTypes = [
  { label: '🫧 Putimas', value: 'putimas' },
  { label: '😣 Skausmas', value: 'skausmas' },
  { label: '🤢 Pykinimas', value: 'pykinimas' },
  { label: '❓ Kita', value: 'kita' }
]

const getSymptomLabel = (type: SymptomType) => {
  return symptomTypes.find(t => t.value === type)?.label || type
}

const uniqueFoodCount = computed(() => {
  const uniqueNames = new Set(foodEntries.value.map(f => f.name.toLowerCase()))
  return uniqueNames.size
})

onMounted(() => {
  loadData()
})
</script>
