<template>
  <div class="min-h-screen bg-gray-50 py-12 px-6">
    <div v-if="provider" class="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <img
        :src="provider.image"
        alt="Provider Image"
        class="w-full h-64 object-cover rounded mb-6"
      />
      <h2 class="text-3xl font-bold mb-2">{{ provider.name }}</h2>
      <p class="text-gray-600 text-lg mb-4">{{ provider.type }}</p>
      <p class="text-gray-700 leading-relaxed">
        {{ provider.description }}
      </p>

      <router-link to="/providers" class="text-blue-600 hover:underline block mt-6">
        ← Back to Providers
      </router-link>
    </div>
    <div v-else class="text-center text-gray-500">Provider not found.</div>
  </div>
</template>

<script>


export default {
  name: 'ProviderDetails',
  props: ['id'],
  data() {
    return {
      providers: [
        {
          id: 1,
          name: 'Mekelle Pension',
          type: 'Pension',
          image: pensionImage,
          description: 'Comfortable and affordable lodging in the heart of Mekelle.'
        },
        {
          id: 2,
          name: 'Sunset Bar',
          type: 'Bar',
          image: barImage,
          description: 'Enjoy a wide selection of drinks with a relaxing atmosphere.'
        },
        {
          id: 3,
          name: 'Mekelle Delight Restaurant',
          type: 'Restaurant',
          image: restaurantImage,
          description: 'Top-rated restaurant serving traditional and modern Ethiopian dishes.'
        },
        {
          id: 4,
          name: 'Beauty Bliss Salon',
          type: 'Beauty Salon',
          image: salonImage,
          description: 'Professional beauty services including hair, nails, and skincare.'
        }
      ]
    };
  },
  computed: {
    provider() {
      return this.providers.find(p => p.id === parseInt(this.id));
    }
  }
};
</script>
