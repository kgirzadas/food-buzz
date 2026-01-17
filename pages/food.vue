<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-2xl mx-auto">
        <div class="mb-6">
          <NuxtLink to="/" class="text-indigo-600 hover:text-indigo-800 flex items-center gap-2">
            ← Atgal į pradžią
          </NuxtLink>
        </div>

        <UCard class="bg-white">
          <template #header>
            <h1 class="text-3xl font-bold text-gray-900">🍽️ Pridėti Maisto Įrašą</h1>
          </template>

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
              <UButton type="submit" size="lg" color="primary" :disabled="!isFormValid">
                Išsaugoti
              </UButton>
              <UButton type="button" size="lg" color="gray" variant="outline" @click="resetForm">
                Išvalyti
              </UButton>
            </div>
          </form>
        </UCard>

        <div v-if="recentEntries.length > 0" class="mt-8">
          <h2 class="text-2xl font-bold mb-4 text-gray-900">Naujausi Įrašai</h2>
          <div class="space-y-3">
            <UCard v-for="entry in recentEntries" :key="entry.id" class="bg-white">
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <h3 class="font-semibold text-lg text-gray-900">{{ entry.name }}</h3>
                  <p class="text-sm text-gray-700">{{ entry.date }} {{ entry.time }}</p>
                  <p v-if="entry.quantity" class="text-sm text-gray-800 mt-1">{{ entry.quantity }}</p>
                  <p v-if="entry.notes" class="text-sm text-gray-700 mt-2">{{ entry.notes }}</p>
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
