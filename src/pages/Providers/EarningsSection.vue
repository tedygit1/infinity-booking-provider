<template>
  <div class="earnings-section">
    <h2 class="title">💰 Earnings Overview</h2>
    <p class="subtitle">Track your income, payments & financial growth</p>

    <!-- Summary Cards -->
    <div class="earnings-summary">
      <div v-for="(card, index) in summaryCards" :key="index" class="summary-card">
        <h3>{{ card.title }}</h3>
        <p class="amount">{{ formatETB(card.value) }}</p>
      </div>
    </div>

    <!-- Earnings Table or Mobile Cards -->
    <div class="table-wrapper">
      <table class="earnings-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Client</th>
            <th>Service</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="e in earnings" :key="e.id">
            <td>{{ e.date }}</td>
            <td>{{ e.client }}</td>
            <td>{{ e.service }}</td>
            <td>{{ formatETB(e.amount) }}</td>
            <td :class="['status-badge', e.status.toLowerCase()]">{{ e.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-if="earnings.length === 0" class="empty-state">
      <p>No earnings recorded yet 📭</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const earnings = ref([]);

const summaryCards = ref([
  { title: "Total Earnings", value: 0 },
  { title: "This Month", value: 0 },
  { title: "Pending Payments", value: 0 },
]);

function formatETB(value) {
  return `${value.toLocaleString()} ETB`;
}

onMounted(() => {
  earnings.value = [
    { id: 1, date: "Oct 25", client: "Sara", service: "massaging", amount: 500, status: "Paid" },
    { id: 2, date: "Oct 20", client: "Dawit", service: "male hair", amount: 900, status: "Paid" },
    { id: 3, date: "Oct 18", client: "Mekdes", service: "Maintenance", amount: 800, status: "Pending" },
  ];

  const total = earnings.value.reduce((sum, e) => sum + e.amount, 0);
  const pending = earnings.value
    .filter(e => e.status === "Pending")
    .reduce((sum, e) => sum + e.amount, 0);

  summaryCards.value = [
    { title: "Total Earnings", value: total },
    { title: "This Month", value: 3400 },
    { title: "Pending Payments", value: pending },
  ];
});
</script>

<style scoped>
.earnings-section {
  padding: 1rem;
  font-family: "Poppins", sans-serif;
  max-width: 1200px;
  margin: 0 auto;
}

.title {
  font-size: 1.6rem;
  font-weight: 700;
  color: #1e40af;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #64748b;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

/* SUMMARY CARDS */
.earnings-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1rem;
  margin-bottom: 1.8rem;
}

.summary-card {
  background: white;
  padding: 1.2rem;
  border-radius: 14px;
  text-align: center;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.06);
  transition: 0.3s ease;
  border-top: 4px solid #3b82f6;
}

.summary-card:hover {
  transform: translateY(-4px);
  box-shadow: 0px 6px 16px rgba(0, 0, 0, 0.08);
}

.summary-card h3 {
  font-size: 0.85rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.4rem;
}

.amount {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0077ff;
  margin: 0;
}

/* TABLE */
.table-wrapper {
  overflow-x: auto;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  -webkit-overflow-scrolling: touch; /* smoother scroll on iOS */
}

.earnings-table {
  width: 100%;
  min-width: 500px; /* ensures table remains readable */
  border-collapse: collapse;
  background: white;
}

.earnings-table th,
.earnings-table td {
  padding: 0.75rem 0.85rem;
  text-align: left;
}

.earnings-table th {
  background: #eff6ff;
  color: #1e3a8a;
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.earnings-table td {
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.92rem;
}

.earnings-table tr:last-child td {
  border-bottom: none;
}

/* STATUS BADGES */
.status-badge {
  padding: 5px 10px;
  border-radius: 20px;
  font-weight: 600;
  text-transform: capitalize;
  font-size: 0.8rem;
  white-space: nowrap;
}

.status-badge.paid {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.pending {
  background: #fff3cd;
  color: #a16207;
}

/* EMPTY STATE */
.empty-state {
  margin-top: 1.8rem;
  text-align: center;
  background: #f8fafc;
  padding: 1.25rem;
  border-radius: 12px;
  color: #8091a7;
  font-size: 0.95rem;
}

/* === MOBILE-FIRST MEDIA QUERIES === */
@media (max-width: 640px) {
  .earnings-section {
    padding: 1rem;
  }

  .title {
    font-size: 1.45rem;
  }

  .subtitle {
    font-size: 0.9rem;
    margin-bottom: 1.3rem;
  }

  .earnings-summary {
    grid-template-columns: 1fr;
    gap: 0.9rem;
  }

  .summary-card {
    padding: 1rem;
  }

  .amount {
    font-size: 1.15rem;
  }

  .earnings-table th,
  .earnings-table td {
    padding: 0.7rem 0.6rem;
    font-size: 0.875rem;
  }

  .status-badge {
    font-size: 0.75rem;
    padding: 4px 8px;
  }

  .earnings-table {
    min-width: 480px; /* Adjust based on content */
  }
}
</style>