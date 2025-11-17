<template>
  <div class="bookings-section">
    <div class="header">
      <h2 class="title">📅 Bookings</h2>
      <p class="subtitle">Manage your client bookings efficiently</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-box">
      <div class="spinner"></div>
      <p class="loading-text">Loading your bookings...</p>
    </div>

    <!-- No Bookings -->
    <div v-else-if="bookings.length === 0" class="no-bookings">
      <div class="empty-icon">
        <i class="fa-regular fa-calendar-check"></i>
      </div>
      <h3>No bookings yet</h3>
      <p>Bookings from clients will appear here once they schedule your services.</p>
    </div>

    <!-- Bookings List -->
    <div v-else class="booking-list">
      <div
        class="booking-card"
        v-for="(b, i) in bookings"
        :key="i"
      >
        <!-- Header -->
        <div class="booking-header">
          <div class="client-info">
            <h3 class="client-name">{{ b.clientName }}</h3>
            <span class="booking-date">{{ b.date }}</span>
          </div>
          <span class="status-badge" :class="b.status.toLowerCase()">
            {{ b.status }}
          </span>
        </div>

        <!-- Details -->
        <div class="booking-details">
          <div class="detail-item">
            <i class="fa fa-tools detail-icon"></i>
            <span>{{ b.service }}</span>
          </div>
          <div class="detail-item">
            <i class="fa fa-phone detail-icon"></i>
            <span>{{ b.phone }}</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div v-if="b.status === 'Pending'" class="actions">
          <button class="btn accept" @click="handleStatus(i, 'Accepted')">
            <i class="fa fa-check"></i> Accept
          </button>
          <button class="btn reject" @click="handleStatus(i, 'Rejected')">
            <i class="fa fa-times"></i> Reject
          </button>
        </div>

        <!-- Already Handled Status -->
        <div v-else class="handled-message">
          <p>
            <i
              class="fa fa-check-circle"
              v-if="b.status === 'Accepted'"
            ></i>
            <i
              class="fa fa-times-circle"
              v-else
            ></i>
            This booking has been <strong>{{ b.status.toLowerCase() }}</strong>.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const loading = ref(true);
const bookings = ref([]);

async function loadBookings() {
  loading.value = true;

  // ✅ TEMP Demo Data
  bookings.value = [
    { clientName: "Sara H.", date: "Oct 30, 2025", service: "House Wiring", phone: "+251 912 345 678", status: "Pending" },
    { clientName: "Michael A.", date: "Nov 3, 2025", service: "Maintenance", phone: "+251 911 223 344", status: "Accepted" },
    { clientName: "Lidiya T.", date: "Nov 4, 2025", service: "Painting", phone: "+251 910 111 222", status: "Pending" },
    { clientName: "Kebede G.", date: "Nov 5, 2025", service: "AC Installation", phone: "+251 913 222 555", status: "Rejected" },
    { clientName: "Selam A.", date: "Nov 6, 2025", service: "Plumbing Fix", phone: "+251 918 888 000", status: "Pending" },
  ];

  loading.value = false;
}

async function handleStatus(index, newStatus) {
  const booking = bookings.value[index];
  if (!confirm(`Mark this booking as ${newStatus}?`)) return;
  const oldStatus = booking.status;
  booking.status = newStatus;
  // ✅ Backend call ready for later
}

onMounted(() => {
  loadBookings();
});
</script>

<style scoped>
.bookings-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  font-family: "Poppins", sans-serif;
}

.header {
  text-align: center;
  margin-bottom: 28px;
}

.title {
  font-size: 2.1rem;
  color: #1e40af;
  font-weight: 700;
  margin-bottom: 0.5rem;
  letter-spacing: -0.5px;
}

.subtitle {
  color: #64748b;
  font-size: 1.05rem;
  line-height: 1.5;
}

/* Loading */
.loading-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  background: #f8fafc;
  border-radius: 20px;
  animation: fadeIn 0.5s ease;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 4px solid #dbeafe;
  border-top-color: #1e40af;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 16px;
}

.loading-text {
  color: #475569;
  font-size: 1.1rem;
}

/* Empty State */
.no-bookings {
  text-align: center;
  padding: 3rem 1.5rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  animation: fadeIn 0.5s ease;
}

.empty-icon {
  width: 80px;
  height: 80px;
  background: rgba(30, 64, 175, 0.08);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: #1e40af;
  font-size: 2.2rem;
}

.no-bookings h3 {
  font-size: 1.7rem;
  color: #0f172a;
  margin-bottom: 12px;
}

.no-bookings p {
  color: #64748b;
  font-size: 1.02rem;
  max-width: 500px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Bookings List */
.booking-list {
  display: grid;
  gap: 22px;
}

.booking-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28);
  border: 1px solid #f1f5f9;
  animation: fadeInUp 0.4s ease;
}

.booking-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.1);
  border-color: #e2e8f0;
}

.booking-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 18px;
  flex-wrap: wrap;
  gap: 12px;
}

.client-info {
  flex: 1;
}

.client-name {
  font-size: 1.4rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  line-height: 1.3;
}

.booking-date {
  font-size: 0.95rem;
  color: #64748b;
  display: block;
  margin-top: 4px;
}

.status-badge {
  padding: 6px 16px;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: capitalize;
  min-width: 85px;
  text-align: center;
}

.status-badge.pending {
  background: #fef3c7;
  color: #92400e;
}
.status-badge.accepted {
  background: #dcfce7;
  color: #166534;
}
.status-badge.rejected {
  background: #fee2e2;
  color: #b91c1c;
}

.booking-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px dashed #e2e8f0;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #334155;
  font-size: 1.02rem;
}

.detail-icon {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1e40af;
  font-size: 0.9rem;
}

/* Buttons */
.actions {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}

.btn {
  flex: 1;
  min-width: 120px;
  padding: 12px 18px;
  border: none;
  border-radius: 14px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
  letter-spacing: 0.4px;
}

.btn.accept {
  background: linear-gradient(120deg, #16a34a, #15803d);
  color: white;
  box-shadow: 0 4px 12px rgba(22, 163, 74, 0.3);
}
.btn.accept:hover {
  background: linear-gradient(120deg, #15803d, #166534);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(22, 163, 74, 0.4);
}

.btn.reject {
  background: linear-gradient(120deg, #dc2626, #b91c1c);
  color: white;
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
}
.btn.reject:hover {
  background: linear-gradient(120deg, #b91c1c, #991b1b);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(220, 38, 38, 0.4);
}

/* Handled Message */
.handled-message {
  background: #f8fafc;
  border-radius: 16px;
  padding: 16px;
  font-size: 1rem;
  color: #475569;
  text-align: center;
  margin-top: 16px;
  border: 1px solid #e2e8f0;
}

.handled-message i {
  margin-right: 8px;
  font-size: 1.2rem;
}

.handled-message i.fa-check-circle {
  color: #16a34a;
}
.handled-message i.fa-times-circle {
  color: #dc2626;
}

/* Animations */
@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ===== RESPONSIVE DESIGN ===== */
@media (max-width: 768px) {
  .bookings-section {
    padding: 20px;
  }

  .booking-card {
    padding: 20px;
  }

  .actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }

  .client-name {
    font-size: 1.3rem;
  }
}

@media (max-width: 480px) {
  .bookings-section {
    padding: 16px;
  }

  .title {
    font-size: 1.8rem;
  }

  .booking-card {
    padding: 18px;
  }

  .client-name {
    font-size: 1.25rem;
  }

  .status-badge {
    padding: 5px 14px;
    font-size: 0.88rem;
  }

  .detail-item {
    font-size: 1rem;
  }
}
</style>