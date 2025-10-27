<template>
  <div class="dashboard-container">
    <!-- Sidebar -->
    <div class="dashboard-sidebar">
      <h2>Provider Dashboard</h2>
      <ul>
        <li @click="activeTab='home'" :class="{ active: activeTab==='home' }">Home</li>
        <li @click="activeTab='profile'" :class="{ active: activeTab==='profile' }">My Profile</li>
        <li @click="activeTab='services'" :class="{ active: activeTab==='services' }">My Services</li>
        <li @click="activeTab='bookings'" :class="{ active: activeTab==='bookings' }">Bookings</li>
        <li @click="activeTab='earnings'" :class="{ active: activeTab==='earnings' }">Earnings</li>
        <li @click="activeTab='messages'" :class="{ active: activeTab==='messages' }">Messages</li>
        <li @click="activeTab='analytics'" :class="{ active: activeTab==='analytics' }">Analytics</li>
        <li @click="activeTab='reviews'" :class="{ active: activeTab==='reviews' }">Reviews</li>
        <li @click="activeTab='settings'" :class="{ active: activeTab==='settings' }">Settings</li>
      </ul>
      <button @click="logout">Logout</button>
    </div>

    <!-- Main Content -->
    <div class="dashboard-main">
      <!-- Home / Overview -->
      <div v-if="activeTab==='home'">
        <h2>Welcome, {{ provider.fullName }}</h2>
        <div class="cards">
          <div class="card">Total Bookings: {{ stats.totalBookings }}</div>
          <div class="card">Upcoming Bookings: {{ stats.upcomingBookings }}</div>
          <div class="card">Completed Bookings: {{ stats.completedBookings }}</div>
          <div class="card">Total Earnings: ${{ stats.totalEarnings }}</div>
        </div>
        <h3>Recent Bookings</h3>
        <table class="table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Service</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="b in recentBookings" :key="b.id">
              <td>{{ b.client }}</td>
              <td>{{ b.service }}</td>
              <td>{{ b.date }}</td>
              <td>{{ b.status }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Profile -->
      <div v-if="activeTab==='profile'">
        <ProfileCard :provider="provider" />
      </div>

      <!-- Services -->
      <div v-if="activeTab==='services'">
        <h2>My Services</h2>
        <ul>
          <li v-for="s in services" :key="s.id">{{ s.name }} - ${{ s.price }}</li>
        </ul>
        <button>Add New Service</button>
      </div>

      <!-- Bookings -->
      <div v-if="activeTab==='bookings'">
        <BookingList :bookings="bookings" />
      </div>

      <!-- Earnings -->
      <div v-if="activeTab==='earnings'">
        <EarningsCard :earnings="earnings" />
        <h3>Payment History</h3>
        <table class="table">
          <thead>
            <tr><th>Date</th><th>Amount</th><th>Status</th></tr>
          </thead>
          <tbody>
            <tr v-for="p in payments" :key="p.id">
              <td>{{ p.date }}</td>
              <td>${{ p.amount }}</td>
              <td>{{ p.status }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Messages -->
      <div v-if="activeTab==='messages'">
        <MessagePanel :messages="messages" />
      </div>

      <!-- Analytics -->
      <div v-if="activeTab==='analytics'">
        <h2>Analytics</h2>
        <p>Charts placeholders (connect chart library later)</p>
        <ul>
          <li>Bookings Over Time (Line Chart)</li>
          <li>Earnings Over Time (Bar Chart)</li>
          <li>Popular Services (Pie Chart)</li>
        </ul>
      </div>

      <!-- Reviews -->
      <div v-if="activeTab==='reviews'">
        <h2>Customer Reviews</h2>
        <ul>
          <li v-for="r in reviews" :key="r.id">
            <strong>{{ r.client }}</strong>: {{ r.text }} (Rating: {{ r.rating }}/5)
          </li>
        </ul>
      </div>

      <!-- Settings -->
      <div v-if="activeTab==='settings'">
        <h2>Settings</h2>
        <p>Change Password | Notification Settings | Payment Setup</p>
        <button>Save Settings</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import ProfileCard from './components/ProfileCard.vue';
import BookingList from './components/BookingList.vue';
import EarningsCard from './components/EarningsCard.vue';
import MessagePanel from './components/MessagePanel.vue';

const router = useRouter();
const activeTab = ref('home');

// ✅ Dummy provider
const provider = ref({
  fullName: 'John Doe',
  email: 'john@example.com',
  phone: '+251912345678',
  category: 'Home Services',
  city: 'Mekelle',
  profileImage: ''
});

// ✅ Dummy bookings
const bookings = ref([
  { id: 1, client: 'Alice', service: 'Cleaning', date: '2025-10-28', status: 'Upcoming' },
  { id: 2, client: 'Bob', service: 'Plumbing', date: '2025-10-29', status: 'Completed' }
]);

// ✅ Dummy earnings
const earnings = ref({
  total: 1500,
  pending: 300,
  lastPayment: '2025-10-20'
});

// ✅ Stats for Home
const stats = ref({
  totalBookings: 25,
  upcomingBookings: 5,
  completedBookings: 20,
  totalEarnings: 1500
});

// ✅ Recent bookings for Home
const recentBookings = ref(bookings.value.slice(-3));

// ✅ Services
const services = ref([
  { id: 1, name: 'Cleaning', price: 50 },
  { id: 2, name: 'Plumbing', price: 75 }
]);

// ✅ Payment history
const payments = ref([
  { id: 1, date: '2025-10-20', amount: 300, status: 'Completed' },
  { id: 2, date: '2025-09-25', amount: 250, status: 'Completed' }
]);

// ✅ Messages
const messages = ref([
  { id: 1, from: 'Alice', text: 'Is the service available tomorrow?', time: '10:30 AM' },
  { id: 2, from: 'Bob', text: 'Can we reschedule?', time: '9:00 AM' }
]);

// ✅ Reviews
const reviews = ref([
  { id: 1, client: 'Alice', text: 'Great service!', rating: 5 },
  { id: 2, client: 'Bob', text: 'Very professional.', rating: 4 }
]);

function logout() {
  localStorage.removeItem('token');
  router.push({ name: 'Login' });
}
</script>

<style scoped>
.dashboard-container {
  display: flex;
  min-height: 100vh;
  font-family: 'Poppins', sans-serif;
}

.dashboard-sidebar {
  width: 220px;
  background: #0077ff;
  color: white;
  padding: 2rem 1rem;
}

.dashboard-sidebar ul {
  list-style: none;
  padding: 0;
}

.dashboard-sidebar li {
  margin: 1rem 0;
  cursor: pointer;
  transition: all 0.3s;
}

.dashboard-sidebar li.active,
.dashboard-sidebar li:hover {
  font-weight: bold;
  text-decoration: underline;
}

.dashboard-sidebar button {
  margin-top: 2rem;
  padding: 0.5rem;
  width: 100%;
  background: white;
  color: #0077ff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.dashboard-main {
  flex: 1;
  padding: 2rem;
  background: #f2f7ff;
}

.cards {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.card {
  flex: 1;
  background: white;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 3px 8px rgba(0,0,0,0.1);
  font-weight: bold;
  text-align: center;
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.table th, .table td {
  border: 1px solid #ccc;
  padding: 0.5rem;
  text-align: left;
}
</style>
