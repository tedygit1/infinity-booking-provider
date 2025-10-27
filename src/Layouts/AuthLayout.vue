<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-sky-400 to-teal-400">
    <div class="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
      <slot /> <!-- This renders router-view -->
    </div>
  </div>
</template>

<script>
export default {
  name: "AuthLayout"
};
</script>

<style scoped>
/* Optional: auth layout styles */
</style>
