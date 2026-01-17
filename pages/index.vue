<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
    <div class="container mx-auto px-4 py-16">
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-12">
          <h1 class="text-5xl font-bold text-gray-900 mb-4">
            🍽️ Maisto Dienoraštis
          </h1>
          <p class="text-xl text-gray-600">
            Maisto produktų ir pilvo simptomų stebėjimo aplikacija
          </p>
        </div>

        <UCard class="mb-8">
          <template #header>
            <h2 class="text-2xl font-semibold">Apie Aplikaciją</h2>
          </template>

          <div class="space-y-4">
            <p class="text-gray-700">
              Ši Progressive Web App (PWA) aplikacija padeda stebėti maisto produktus ir pilvo simptomus,
              siekiant identifikuoti galimus ryšius tarp suvalgytų produktų ir nepageidaujamų simptomų.
            </p>

            <div class="grid md:grid-cols-3 gap-4 mt-6">
              <div class="p-4 bg-indigo-50 rounded-lg">
                <div class="text-3xl mb-2">📝</div>
                <h3 class="font-semibold mb-1">Registruokite</h3>
                <p class="text-sm text-gray-600">Fiksuokite suvalgytus produktus ir jų kiekius</p>
              </div>

              <div class="p-4 bg-purple-50 rounded-lg">
                <div class="text-3xl mb-2">🔍</div>
                <h3 class="font-semibold mb-1">Stebėkite</h3>
                <p class="text-sm text-gray-600">Sekite simptomus: putimą, skausmą, pykinimą</p>
              </div>

              <div class="p-4 bg-pink-50 rounded-lg">
                <div class="text-3xl mb-2">📊</div>
                <h3 class="font-semibold mb-1">Analizuokite</h3>
                <p class="text-sm text-gray-600">Atpažinkite ryšius tarp maisto ir simptomų</p>
              </div>
            </div>
          </div>
        </UCard>

        <div class="grid md:grid-cols-3 gap-4 mb-8">
          <UCard class="text-center hover:shadow-lg transition-shadow cursor-pointer" @click="navigateTo('/food')">
            <div class="text-4xl mb-3">🍽️</div>
            <h3 class="font-semibold text-lg mb-2">Pridėti Maistą</h3>
            <p class="text-sm text-gray-600">Užregistruokite suvalgytus produktus</p>
            <UButton color="primary" class="mt-4" block>
              Pradėti
            </UButton>
          </UCard>

          <UCard class="text-center hover:shadow-lg transition-shadow cursor-pointer" @click="navigateTo('/symptoms')">
            <div class="text-4xl mb-3">🩺</div>
            <h3 class="font-semibold text-lg mb-2">Pridėti Simptomą</h3>
            <p class="text-sm text-gray-600">Fiksuokite nepageidaujamus simptomus</p>
            <UButton color="primary" class="mt-4" block>
              Pradėti
            </UButton>
          </UCard>

          <UCard class="text-center hover:shadow-lg transition-shadow cursor-pointer" @click="navigateTo('/diary')">
            <div class="text-4xl mb-3">📖</div>
            <h3 class="font-semibold text-lg mb-2">Peržiūrėti Dienoraštį</h3>
            <p class="text-sm text-gray-600">Analizuokite savo įrašus</p>
            <UButton color="primary" class="mt-4" block>
              Atidaryti
            </UButton>
          </UCard>
        </div>

        <div class="text-center">
          <UButton size="xl" color="primary" @click="installPWA" v-if="showInstallButton">
            📱 Įdiegti Aplikaciją
          </UButton>
          <p v-if="showInstallButton" class="text-sm text-gray-500 mt-4">
            Greičiau pradėkite – įdiekite aplikaciją į savo įrenginį!
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { loadData } = useFoodDiary()

const showInstallButton = ref(false)
let deferredPrompt: any = null

onMounted(() => {
  loadData()

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt = e
    showInstallButton.value = true
  })
})

const installPWA = async () => {
  if (!deferredPrompt) return

  deferredPrompt.prompt()
  const { outcome } = await deferredPrompt.userChoice

  if (outcome === 'accepted') {
    showInstallButton.value = false
  }

  deferredPrompt = null
}
</script>
