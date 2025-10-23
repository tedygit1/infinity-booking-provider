<template>
  <div class="card" @click="goToBooking">
    <h3>{{ title }}</h3>
    <p>{{ description }}</p>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  title: String,
  description: String
})

const router = useRouter()

function goToBooking() {
  // Send the selected service name to Booking page
  router.push({ name: 'Booking', query: { service: props.title } })
}
</script>

<style scoped>
.card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 15px;
  margin: 10px 0;
  background: #fafafa;
  cursor: pointer;
  transition: 0.2s;
}
.card:hover {
  box-shadow: 0 0 10px #aaa;
}
</style>
