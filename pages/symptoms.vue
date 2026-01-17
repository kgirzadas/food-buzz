<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-2xl mx-auto">
        <div class="mb-6">
          <NuxtLink to="/" class="text-indigo-600 hover:text-indigo-800 flex items-center gap-2">
            ← Atgal į pradžią
          </NuxtLink>
        </div>

        <UCard>
          <template #header>
            <h1 class="text-3xl font-bold">🩺 Pridėti Simptomą</h1>
          </template>

          <form @submit.prevent="submitForm" class="space-y-4">
            <UFormGroup label="Data" required>
              <UInput v-model="form.date" type="date" :max="today" />
            </UFormGroup>

            <UFormGroup label="Laikas" required>
              <UInput v-model="form.time" type="time" />
            </UFormGroup>

            <UFormGroup label="Simptomo tipas" required>
              <USelectMenu
                v-model="form.type"
                :options="symptomTypes"
                option-attribute="label"
                value-attribute="value"
              />
            </UFormGroup>

            <UFormGroup label="Intensyvumas (1-5)" required>
              <div class="flex gap-2">
                <UButton
                  v-for="level in [1, 2, 3, 4, 5]"
                  :key="level"
                  type="button"
                  :color="form.severity === level ? 'primary' : 'gray'"
                  :variant="form.severity === level ? 'solid' : 'outline'"
                  @click="form.severity = level as any"
                  size="lg"
                >
                  {{ level }}
                </UButton>
              </div>
              <p class="text-xs text-gray-500 mt-2">
                1 = Lengvas, 5 = Labai stiprus
              </p>
            </UFormGroup>

            <UFormGroup label="Pastabos">
              <UTextarea v-model="form.notes" placeholder="Papildoma informacija..." :rows="3" />
            </UFormGroup>

            <div v-if="recentFoodOptions.length > 0">
              <UFormGroup label="Susiję maisto produktai (neprivaloma)">
                <div class="space-y-2">
                  <label v-for="food in recentFoodOptions" :key="food.id" class="flex items-center gap-2">
                    <input
                      type="checkbox"
                      :value="food.id"
                      v-model="form.relatedFoods"
                      class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span class="text-sm">{{ food.name }} ({{ food.date }} {{ food.time }})</span>
                  </label>
                </div>
              </UFormGroup>
            </div>

            <div class="flex gap-3 pt-4">
              <UButton type="submit" size="lg" color="primary" :disabled="!isFormValid">
                Išsaugoti
              </UButton>
              <UButton type="button" size="lg" color="gray" variant="outline" @click="resetForm">
                Išvalyti
              </UButton>
            </div>
          </form>
        </UCard>

        <div v-if="recentSymptoms.length > 0" class="mt-8">
          <h2 class="text-2xl font-bold mb-4">Naujausi Simptomai</h2>
          <div class="space-y-3">
            <UCard v-for="entry in recentSymptoms" :key="entry.id">
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <div class="flex items-center gap-2">
                    <h3 class="font-semibold text-lg">{{ getSymptomLabel(entry.type) }}</h3>
                    <span class="text-sm px-2 py-1 bg-indigo-100 text-indigo-800 rounded">
                      {{ entry.severity }}/5
                    </span>
                  </div>
                  <p class="text-sm text-gray-600">{{ entry.date }} {{ entry.time }}</p>
                  <p v-if="entry.notes" class="text-sm text-gray-600 mt-2">{{ entry.notes }}</p>
                  <div v-if="entry.relatedFoods && entry.relatedFoods.length > 0" class="mt-2">
                    <p class="text-xs text-gray-500">Susiję produktai:</p>
                    <ul class="text-sm text-gray-600 list-disc list-inside">
                      <li v-for="foodId in entry.relatedFoods" :key="foodId">
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
                  @click="deleteEntry(entry.id)"
                />
              </div>
            </UCard>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SymptomType } from '~/types'

const { addSymptomEntry, deleteSymptomEntry, symptomEntries, foodEntries, getRecentFoodEntries, loadData } = useFoodDiary()

const symptomTypes = [
  { label: '🫧 Putimas', value: 'putimas' },
  { label: '😣 Skausmas', value: 'skausmas' },
  { label: '🤢 Pykinimas', value: 'pykinimas' },
  { label: '❓ Kita', value: 'kita' }
]

const today = computed(() => new Date().toISOString().split('T')[0])
const currentTime = computed(() => new Date().toTimeString().slice(0, 5))

const form = ref({
  date: today.value,
  time: currentTime.value,
  type: 'putimas' as SymptomType,
  severity: 3 as 1 | 2 | 3 | 4 | 5,
  notes: '',
  relatedFoods: [] as string[]
})

const recentFoodOptions = computed(() => {
  return getRecentFoodEntries().slice(0, 10)
})

const recentSymptoms = computed(() => {
  return symptomEntries.value
    .sort((a, b) => {
      const dateTimeA = `${a.date} ${a.time}`
      const dateTimeB = `${b.date} ${b.time}`
      return dateTimeB.localeCompare(dateTimeA)
    })
    .slice(0, 10)
})

const isFormValid = computed(() => {
  return form.value.date && form.value.time && form.value.type && form.value.severity
})

const getSymptomLabel = (type: SymptomType) => {
  return symptomTypes.find(t => t.value === type)?.label || type
}

const getFoodName = (foodId: string) => {
  return foodEntries.value.find(f => f.id === foodId)?.name || 'Nežinomas produktas'
}

const submitForm = () => {
  if (!isFormValid.value) return

  addSymptomEntry({
    date: form.value.date,
    time: form.value.time,
    type: form.value.type,
    severity: form.value.severity,
    notes: form.value.notes.trim(),
    relatedFoods: form.value.relatedFoods.length > 0 ? form.value.relatedFoods : undefined
  })

  // Reset form but keep date/time
  form.value.notes = ''
  form.value.relatedFoods = []

  alert('Simptomai išsaugoti!')
}

const resetForm = () => {
  form.value = {
    date: today.value,
    time: currentTime.value,
    type: 'putimas',
    severity: 3,
    notes: '',
    relatedFoods: []
  }
}

const deleteEntry = (id: string) => {
  if (confirm('Ar tikrai norite ištrinti šį įrašą?')) {
    deleteSymptomEntry(id)
  }
}

onMounted(() => {
  loadData()
})
</script>
