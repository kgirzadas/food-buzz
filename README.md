# 🍽️ Maisto Dienoraštis

Progressive Web App (PWA) aplikacija maisto produktų ir pilvo simptomų stebėjimui. Padeda identifikuoti galimus ryšius tarp suvalgytų produktų ir nepageidaujamų simptomų (putimo, skausmo, pykinimo).

## ✨ Funkcionalumas

- 📝 **Maisto Registravimas** - Fiksuokite suvalgytus produktus ir jų kiekius
- 🔍 **Simptomų Stebėjimas** - Sekite simptomus: putimą, skausmą, pykinimą
- 📊 **Duomenų Analizė** - Atpažinkite ryšius tarp maisto ir simptomų
- 📱 **PWA Palaikymas** - Įdiekite aplikaciją į savo įrenginį
- 🌐 **Veikia Neprisijungus** - Naudokite be interneto ryšio

## 🚀 Technologijos

- **Nuxt 3** - Vue.js framework
- **Nuxt UI** - Modernus komponentų rinkinys
- **Vite PWA** - Progressive Web App funkcionalumas
- **TypeScript** - Tipų saugumas
- **GitHub Pages** - Nemokamas hostingas

## 🛠️ Kūrimas Lokaliai

### Reikalavimai

- Node.js 18+
- npm arba yarn

### Paleidimas

```bash
# Įdiekite priklausomybes
npm install

# Paleiskite dev serverį
npm run dev

# Aplikacija bus prieinama: http://localhost:3000
```

### Build

```bash
# Sukurkite produkcinę versiją
npm run build

# Peržiūrėkite build rezultatą
npm run preview

# Generuokite statinį puslapį
npm run generate
```

## 📦 Deployment

Aplikacija automatiškai deployinama į GitHub Pages naudojant GitHub Actions:

1. Push į `main` arba `claude/*` branches automatiškai paleidžia deployment
2. Arba rankiniu būdu: **Actions** → **Deploy to GitHub Pages** → **Run workflow**

### GitHub Pages Nustatymai

1. Eikite į **Settings** → **Pages**
2. Source: pasirinkite **GitHub Actions**
3. Aplikacija bus prieinama: `https://[username].github.io/food-buzz/`

## 📱 PWA Funkcijos

Aplikacija palaiko:
- ✅ Įdiegimą į įrenginį
- ✅ Offline režimą
- ✅ Push pranešimus (planuojama)
- ✅ Greitą įkėlimą
- ✅ Automatinį atnaujinimą

## 🗂️ Projekto Struktūra

```
food-buzz/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deployment
├── pages/
│   └── index.vue               # Pagrindinis puslapis
├── public/
│   ├── icons/                  # PWA ikonos
│   └── favicon.ico             # Favicon
├── app.vue                     # Root komponentas
├── nuxt.config.ts              # Nuxt konfigūracija
├── package.json                # Priklausomybės
└── tsconfig.json               # TypeScript config
```

## 🔜 Ateities Planai

- [ ] Maisto produktų sąrašas su paieška
- [ ] Simptomų registravimo forma
- [ ] Duomenų saugojimas (localStorage / IndexedDB)
- [ ] Statistikos ir grafikai
- [ ] Duomenų eksportavimas
- [ ] Tamsaus režimo palaikymas
- [ ] Lietuvių ir anglų kalbų palaikymas

## 📄 Licencija

MIT

## 🤝 Kontribucija

Pull requests yra laukiami! Didesnėms korekcijoms, pirmiausia atidarykite issue ir aptarkime.

---

**Pastaba**: Ši aplikacija neskirta medicininiam diagnozavimui. Konsultuokitės su sveikatos priežiūros specialistu dėl sveikatos problemų.
