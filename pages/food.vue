<template>
  <div class="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-2xl mx-auto">
        <div class="mb-6">
          <NuxtLink to="/" class="inline-flex items-center gap-2 text-white hover:text-purple-200 transition-colors font-semibold">
            <span class="text-xl">←</span> Atgal į pradžią
          </NuxtLink>
        </div>

        <div class="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          <div class="flex items-center gap-3 mb-6">
            <div class="text-5xl">🍽️</div>
            <h1 class="text-3xl font-bold text-gray-900">{{ editingId ? 'Redaguoti Įrašą' : 'Pridėti Maisto Įrašą' }}</h1>
          </div>

          <form @submit.prevent="submitForm" class="space-y-4">
            <UFormGroup label="Data" required>
              <UInput v-model="form.date" type="date" :max="today" />
            </UFormGroup>

            <UFormGroup label="Laikas" required>
              <UInput v-model="form.time" type="time" />
            </UFormGroup>

            <UFormGroup label="Maisto pavadinimas" required>
              <UInput v-model="form.name" placeholder="pvz., Grietinėlės sūris" />
            </UFormGroup>

            <UFormGroup label="Kiekis">
              <UInput v-model="form.quantity" placeholder="pvz., 100g, 1 vnt., 2 šaukštai" />
            </UFormGroup>

            <UFormGroup label="Pastabos">
              <UTextarea v-model="form.notes" placeholder="Papildoma informacija..." :rows="3" />
            </UFormGroup>

            <div class="flex gap-3 pt-4">
              <button
                type="submit"
                :disabled="!isFormValid"
                class="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ editingId ? '✓ Atnaujinti' : '✓ Išsaugoti' }}
              </button>
              <button
                type="button"
                @click="cancelEdit"
                class="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
              >
                {{ editingId ? '✕ Atšaukti' : '✕ Išvalyti' }}
              </button>
            </div>
          </form>
        </div>

        <div v-if="recentEntries.length > 0" class="mt-8">
          <h2 class="text-2xl font-bold mb-4 text-white">Naujausi Įrašai</h2>
          <div class="space-y-3">
            <div v-for="entry in recentEntries" :key="entry.id" class="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition-shadow">
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <h3 class="font-semibold text-lg text-gray-900">{{ entry.name }}</h3>
                  <p class="text-sm text-gray-700">{{ entry.date }} {{ entry.time }}</p>
                  <p v-if="entry.quantity" class="text-sm text-gray-800 mt-1">{{ entry.quantity }}</p>
                  <p v-if="entry.notes" class="text-sm text-gray-700 mt-2">{{ entry.notes }}</p>
                </div>
                <div class="flex gap-2">
                  <button
                    @click="editEntry(entry)"
                    class="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg transition-all"
                  >
                    <span class="text-xl">✏️</span>
                  </button>
                  <button
                    @click="deleteEntry(entry.id)"
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
</template>

<script setup lang="ts">
import type { FoodEntry } from '~/types'

const { addFoodEntry, updateFoodEntry, deleteFoodEntry, getRecentFoodEntries, loadData } = useFoodDiary()

const editingId = ref<string | null>(null)

// Helper to get local date in YYYY-MM-DD format (not UTC!)
const getLocalDateString = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Get today's date in YYYY-MM-DD format (local time)
const today = computed(() => getLocalDateString(new Date()))

// Get current time in HH:MM format
const currentTime = computed(() => {
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
})

// Smart default date: if it's between midnight and 6 AM, use yesterday's date
// (because it's usually a continuation of yesterday's meals)
const getSmartDefaultDate = () => {
  const now = new Date()
  const hours = now.getHours()

  // If it's between 0:00 and 5:59 AM, use yesterday
  if (hours >= 0 && hours < 6) {
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)
    return getLocalDateString(yesterday)
  }

  return getLocalDateString(now)
}

const form = ref({
  date: getSmartDefaultDate(),
  time: currentTime.value,
  name: '',
  quantity: '',
  notes: ''
})

const recentEntries = computed(() => {
  return getRecentFoodEntries().sort((a, b) => {
    const dateTimeA = `${a.date} ${a.time}`
    const dateTimeB = `${b.date} ${b.time}`
    return dateTimeB.localeCompare(dateTimeA)
  }).slice(0, 10)
})

const isFormValid = computed(() => {
  return form.value.date && form.value.time && form.value.name.trim()
})

const submitForm = () => {
  if (!isFormValid.value) return

  if (editingId.value) {
    // Update existing entry
    updateFoodEntry(editingId.value, {
      date: form.value.date,
      time: form.value.time,
      name: form.value.name.trim(),
      quantity: form.value.quantity.trim(),
      notes: form.value.notes.trim()
    })
    alert('Įrašas atnaujintas!')
    editingId.value = null
  } else {
    // Add new entry
    addFoodEntry({
      date: form.value.date,
      time: form.value.time,
      name: form.value.name.trim(),
      quantity: form.value.quantity.trim(),
      notes: form.value.notes.trim()
    })
    alert('Įrašas išsaugotas!')
  }

  // Reset name, quantity, notes but keep date/time
  form.value.name = ''
  form.value.quantity = ''
  form.value.notes = ''
}

const cancelEdit = () => {
  editingId.value = null
  form.value = {
    date: getSmartDefaultDate(),
    time: currentTime.value,
    name: '',
    quantity: '',
    notes: ''
  }
}

const editEntry = (entry: FoodEntry) => {
  editingId.value = entry.id
  form.value = {
    date: entry.date,
    time: entry.time,
    name: entry.name,
    quantity: entry.quantity || '',
    notes: entry.notes || ''
  }
  // Scroll to top to show the form
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const deleteEntry = (id: string) => {
  if (confirm('Ar tikrai norite ištrinti šį įrašą?')) {
    deleteFoodEntry(id)
    // If we were editing this entry, cancel the edit
    if (editingId.value === id) {
      cancelEdit()
    }
  }
}

// Load data on mount
onMounted(() => {
  loadData()
})
</script>
