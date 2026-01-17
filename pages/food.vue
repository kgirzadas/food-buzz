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
            <h1 class="text-3xl font-bold text-gray-900">Pridėti Maisto Įrašą</h1>
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
                ✓ Išsaugoti
              </button>
              <button
                type="button"
                @click="resetForm"
                class="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
              >
                ✕ Išvalyti
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
</template>

<script setup lang="ts">
const { addFoodEntry, deleteFoodEntry, getRecentFoodEntries, loadData } = useFoodDiary()

// Get today's date in YYYY-MM-DD format
const today = computed(() => new Date().toISOString().split('T')[0])

// Get current time in HH:MM format
const currentTime = computed(() => {
  const now = new Date()
  return now.toTimeString().slice(0, 5)
})

const form = ref({
  date: today.value,
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

  addFoodEntry({
    date: form.value.date,
    time: form.value.time,
    name: form.value.name.trim(),
    quantity: form.value.quantity.trim(),
    notes: form.value.notes.trim()
  })

  // Reset name, quantity, notes but keep date/time
  form.value.name = ''
  form.value.quantity = ''
  form.value.notes = ''

  // Show success (optional)
  alert('Įrašas išsaugotas!')
}

const resetForm = () => {
  form.value = {
    date: today.value,
    time: currentTime.value,
    name: '',
    quantity: '',
    notes: ''
  }
}

const deleteEntry = (id: string) => {
  if (confirm('Ar tikrai norite ištrinti šį įrašą?')) {
    deleteFoodEntry(id)
  }
}

// Load data on mount
onMounted(() => {
  loadData()
})
</script>
