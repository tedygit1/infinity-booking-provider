<template>
  <div class="profile-card">
    <img :src="provider.profileImage || defaultImg" alt="Profile" class="profile-img" />
    <h2>{{ provider.fullName }}</h2>
    <p><strong>Email:</strong> {{ provider.email }}</p>
    <p><strong>Phone:</strong> {{ provider.phone }}</p>
    <p><strong>Category:</strong> {{ provider.category }}</p>
    <p><strong>City:</strong> {{ provider.city }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const props = defineProps({
  provider: Object
});

const defaultImg = 'https://via.placeholder.com/120';
</script>

<style scoped>
.profile-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
  max-width: 400px;
  text-align: center;
  margin: auto;
}

.profile-img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1rem;
}

h2 {
  margin-bottom: 0.5rem;
  color: #0077ff;
}

p {
  margin: 0.3rem 0;
  color: #333;
}
</style>
