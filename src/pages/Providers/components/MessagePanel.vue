<template>
  <div class="message-panel">
    <h2>Messages</h2>
    <div class="message" v-for="m in messages" :key="m.id">
      <p><strong>{{ m.from }}:</strong> {{ m.text }}</p>
      <small>{{ m.time }}</small>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  messages: Array
});
</script>

<style scoped>
.message-panel {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
}

h2 {
  color: #0077ff;
  margin-bottom: 1rem;
}

.message {
  background: #f2f7ff;
  padding: 0.8rem 1rem;
  border-radius: 8px;
  margin-bottom: 0.5rem;
}

.message p {
  margin: 0;
}

.message small {
  color: #666;
  font-size: 0.8rem;
}
</style>
