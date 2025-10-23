<template>
  <div
    class="provider-card bg-white/20 backdrop-blur-md rounded-xl overflow-hidden shadow-md hover:shadow-xl transform transition duration-300 hover:scale-105"
  >
    <img :src="image" alt="provider" class="w-full h-48 object-cover" />
    <div class="p-4">
      <h3 class="text-xl font-semibold mb-1 text-gray-900">{{ name }}</h3>
      <p class="text-gray-700 mb-3">{{ type }}</p>
      <router-link
        to="/login"
        class="block w-full text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
      >
        View Details
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProviderCard',
  props: {
    name: String,
    type: String,
    image: String,
  },
};
</script>

<style scoped>
.provider-card {
  border: 1px solid rgba(255, 255, 255, 0.2);
}
</style>
