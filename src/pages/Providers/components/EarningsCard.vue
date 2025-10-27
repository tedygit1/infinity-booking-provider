<template>
  <div class="earnings-card">
    <h2>Earnings Overview</h2>
    <div class="earnings-grid">
      <div class="card">
        <h3>Total Earnings</h3>
        <p>${{ earnings.total }}</p>
      </div>
      <div class="card">
        <h3>Pending</h3>
        <p>${{ earnings.pending }}</p>
      </div>
      <div class="card">
        <h3>Last Payment</h3>
        <p>{{ earnings.lastPayment }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  earnings: Object
});
</script>

<style scoped>
.earnings-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
}

h2 {
  color: #0077ff;
  margin-bottom: 1rem;
}

.earnings-grid {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.card {
  flex: 1;
  min-width: 120px;
  background: #f2f7ff;
  padding: 1rem;
  border-radius: 10px;
  text-align: center;
}

.card h3 {
  color: #0077ff;
  margin-bottom: 0.5rem;
}

.card p {
  font-weight: bold;
  font-size: 1.2rem;
}
</style>
