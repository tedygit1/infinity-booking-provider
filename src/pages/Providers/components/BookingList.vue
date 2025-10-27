<template>
  <div class="booking-list">
    <h2>My Bookings</h2>
    <table>
      <thead>
        <tr>
          <th>Client</th>
          <th>Service</th>
          <th>Date</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="b in bookings" :key="b.id">
          <td>{{ b.client }}</td>
          <td>{{ b.service }}</td>
          <td>{{ b.date }}</td>
          <td :class="b.status.toLowerCase()">{{ b.status }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
const props = defineProps({
  bookings: Array
});
</script>

<style scoped>
.booking-list {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
}

h2 {
  color: #0077ff;
  margin-bottom: 1rem;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 0.8rem;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

td.upcoming {
  color: #0077ff;
  font-weight: bold;
}

td.completed {
  color: green;
  font-weight: bold;
}
</style>
