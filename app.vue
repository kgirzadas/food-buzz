<template>
  <div>
    <NuxtPage />
  </div>
</template>

<style>
/* Fix form label contrast - make labels darker and more visible */
label {
  color: #111827 !important; /* gray-900 */
  font-weight: 600 !important;
}

/* Ensure input labels are visible */
.formkit-outer label,
.formkit-wrapper label {
  color: #111827 !important;
}
</style>
