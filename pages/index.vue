<template>
  <div class="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700">
    <div class="container mx-auto px-4 py-12">
      <div class="max-w-6xl mx-auto">
        <!-- Header -->
        <div class="text-center mb-12">
          <div class="inline-block mb-6">
            <div class="text-7xl mb-4 animate-bounce">🍽️</div>
          </div>
          <h1 class="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            Maisto Dienoraštis
          </h1>
          <p class="text-xl md:text-2xl text-purple-100">
            Sekite maistą ir simptomus akimirksniu
          </p>
        </div>

        <!-- Main Action Cards -->
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <!-- Food Card -->
          <div
            @click="navigateTo('/food')"
            class="group relative bg-white rounded-3xl p-8 shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
          >
            <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-bl-full opacity-20"></div>
            <div class="text-6xl mb-4">🍽️</div>
            <h3 class="text-2xl font-bold text-gray-900 mb-3">Pridėti Maistą</h3>
            <p class="text-gray-600 mb-6">Užregistruokite suvalgytus produktus</p>
            <button class="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg">
              Pradėti →
            </button>
          </div>

          <!-- Symptoms Card -->
          <div
            @click="navigateTo('/symptoms')"
            class="group relative bg-white rounded-3xl p-8 shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
          >
            <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-red-400 to-rose-500 rounded-bl-full opacity-20"></div>
            <div class="text-6xl mb-4">🩺</div>
            <h3 class="text-2xl font-bold text-gray-900 mb-3">Pridėti Simptomą</h3>
            <p class="text-gray-600 mb-6">Fiksuokite nepageidaujamus simptomus</p>
            <button class="w-full bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-red-600 hover:to-rose-700 transition-all shadow-lg">
              Pradėti →
            </button>
          </div>

          <!-- Diary Card -->
          <div
            @click="navigateTo('/diary')"
            class="group relative bg-white rounded-3xl p-8 shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
          >
            <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-bl-full opacity-20"></div>
            <div class="text-6xl mb-4">📖</div>
            <h3 class="text-2xl font-bold text-gray-900 mb-3">Peržiūrėti Dienoraštį</h3>
            <p class="text-gray-600 mb-6">Analizuokite savo įrašus</p>
            <button class="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg">
              Atidaryti →
            </button>
          </div>

          <!-- Insights Card -->
          <div
            @click="navigateTo('/insights')"
            class="group relative bg-white rounded-3xl p-8 shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
          >
            <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-bl-full opacity-20"></div>
            <div class="text-6xl mb-4">📊</div>
            <h3 class="text-2xl font-bold text-gray-900 mb-3">Analizė ir Įžvalgos</h3>
            <p class="text-gray-600 mb-6">Raskite ryšius tarp maisto ir simptomų</p>
            <button class="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg">
              Peržiūrėti →
            </button>
          </div>
        </div>

        <!-- Features Section -->
        <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-8 mb-8 border border-white/20">
          <h2 class="text-3xl font-bold text-white mb-6 text-center">Kodėl Verta Naudoti?</h2>
          <div class="grid md:grid-cols-3 gap-6">
            <div class="text-center">
              <div class="text-5xl mb-3">✏️</div>
              <h3 class="text-xl font-semibold text-white mb-2">Redaguokite Įrašus</h3>
              <p class="text-purple-100">Taisykite klaidas ar papildykite informaciją bet kada</p>
            </div>
            <div class="text-center">
              <div class="text-5xl mb-3">🔍</div>
              <h3 class="text-xl font-semibold text-white mb-2">Išsami Paieška</h3>
              <p class="text-purple-100">Filtruokite įrašus pagal datą, tipą ar raktažodžius</p>
            </div>
            <div class="text-center">
              <div class="text-5xl mb-3">🎯</div>
              <h3 class="text-xl font-semibold text-white mb-2">Automatinė Analizė</h3>
              <p class="text-purple-100">Aptikite ryšius tarp maisto produktų ir simptomų</p>
            </div>
          </div>
        </div>

        <!-- PWA Install -->
        <div v-if="showInstallButton" class="text-center">
          <button
            @click="installPWA"
            class="inline-flex items-center gap-3 bg-white text-purple-700 font-bold py-4 px-8 rounded-full hover:bg-purple-50 transition-all shadow-2xl hover:shadow-purple-500/50 text-lg"
          >
            <span class="text-2xl">📱</span>
            Įdiegti Aplikaciją
          </button>
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
