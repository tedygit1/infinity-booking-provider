<template>
  <div class="analytics-section">
    <div class="header">
      <h2 class="title">📊 Analytics Overview</h2>
      <p class="subtitle">Visual insights into your service performance</p>
    </div>

    <!-- Date Range Selector -->
    <div class="date-range-selector">
      <select v-model="selectedDateRange" @change="fetchAnalyticsData">
        <option value="7">Last 7 Days</option>
        <option value="30">Last 30 Days</option>
        <option value="90">Last 90 Days</option>
        <option value="365">Last Year</option>
      </select>
      <div class="date-range-display">
        <i class="fa-solid fa-calendar"></i>
        <span>{{ formatDateRange() }}</span>
      </div>
    </div>

    <!-- Charts Grid -->
    <div class="charts-grid">
      <!-- Bookings Chart -->
      <div class="chart-container">
        <div class="chart-header">
          <h3><i class="fa-solid fa-calendar-check"></i> Bookings Overview</h3>
          <div class="chart-stats">
            <span class="stat-badge total">{{ totalBookings }} Total</span>
            <span class="stat-badge completed">{{ completedBookings }} Completed</span>
            <span class="stat-badge pending">{{ pendingBookings }} Pending</span>
          </div>
        </div>
        <div class="chart-wrapper">
          <!-- Chart will be inserted here -->
          <canvas ref="bookingsChart"></canvas>
        </div>
      </div>

      <!-- Revenue Chart -->
      <div class="chart-container">
        <div class="chart-header">
          <h3><i class="fa-solid fa-money-bill-wave"></i> Revenue Trend</h3>
          <div class="chart-stats">
            <span class="stat-badge revenue">${{ totalRevenue.toLocaleString() }}</span>
            <span :class="['stat-badge', revenueChange >= 0 ? 'positive' : 'negative']">
              <i :class="revenueChange >= 0 ? 'fa-solid fa-arrow-up' : 'fa-solid fa-arrow-down'"></i>
              {{ Math.abs(revenueChange) }}%
            </span>
          </div>
        </div>
        <div class="chart-wrapper">
          <canvas ref="revenueChart"></canvas>
        </div>
      </div>

      <!-- Reviews Chart -->
      <div class="chart-container">
        <div class="chart-header">
          <h3><i class="fa-solid fa-star"></i> Customer Reviews</h3>
          <div class="chart-stats">
            <span class="stat-badge average">{{ averageRating.toFixed(1) }} Avg</span>
            <span class="stat-badge total">{{ totalReviews }} Reviews</span>
          </div>
        </div>
        <div class="chart-wrapper">
          <canvas ref="reviewsChart"></canvas>
        </div>
      </div>

      <!-- Service Performance -->
      <div class="chart-container">
        <div class="chart-header">
          <h3><i class="fa-solid fa-chart-pie"></i> Service Distribution</h3>
          <div class="chart-stats">
            <span class="stat-badge popular">{{ mostPopularService }}</span>
          </div>
        </div>
        <div class="chart-wrapper">
          <canvas ref="servicesChart"></canvas>
        </div>
      </div>
    </div>

    <!-- Analytics Summary Cards -->
    <div class="analytics-cards">
      <div class="analytic-card top-service">
        <div class="card-icon">
          <i class="fa-solid fa-medal"></i>
        </div>
        <h3>Top Service</h3>
        <p>{{ analytics.topService }}</p>
        <div class="card-subtext">
          {{ topServiceBookings }} bookings this period
        </div>
      </div>

      <div class="analytic-card satisfaction">
        <div class="card-icon">
          <i class="fa-solid fa-face-smile"></i>
        </div>
        <h3>Customer Satisfaction</h3>
        <p>{{ animatedSatisfaction }}%</p>
        <div class="rating-stars">
          <i v-for="n in 5" :key="n" class="fa-solid fa-star" 
             :class="{ 'filled': n <= Math.round(averageRating) }"></i>
        </div>
      </div>

      <div class="analytic-card response-time">
        <div class="card-icon">
          <i class="fa-solid fa-clock"></i>
        </div>
        <h3>Avg Response Time</h3>
        <p>{{ analytics.responseTime }} hrs</p>
        <div class="card-subtext" :class="responseTimeClass">
          {{ responseTimeStatus }}
        </div>
      </div>

      <div class="analytic-card conversion">
        <div class="card-icon">
          <i class="fa-solid fa-chart-line"></i>
        </div>
        <h3>Conversion Rate</h3>
        <p>{{ conversionRate }}%</p>
        <div class="card-subtext">
          {{ inquiries }} inquiries → {{ totalBookings }} bookings
        </div>
      </div>
    </div>

    <!-- Loading Overlay -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <p>Loading analytics data...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import Chart from 'chart.js/auto';

const analytics = ref({
  topService: "Electrical Maintenance",
  satisfaction: 94,
  responseTime: 2,
});

const animatedSatisfaction = ref(0);
const loading = ref(false);
const selectedDateRange = ref("30");

// Chart instances
const bookingsChart = ref(null);
const revenueChart = ref(null);
const reviewsChart = ref(null);
const servicesChart = ref(null);

// Data refs
const bookingsData = ref([]);
const revenueData = ref([]);
const reviewsData = ref([]);
const servicesData = ref([]);
const totalBookings = ref(0);
const completedBookings = ref(0);
const pendingBookings = ref(0);
const totalRevenue = ref(0);
const revenueChange = ref(0);
const averageRating = ref(0);
const totalReviews = ref(0);
const mostPopularService = ref("");
const topServiceBookings = ref(0);
const conversionRate = ref(0);
const inquiries = ref(0);

function animateSatisfaction(target) {
  let current = 0;
  const step = Math.ceil(target / 40);
  const interval = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(interval);
    }
    animatedSatisfaction.value = current;
  }, 20);
}

function formatDateRange() {
  const days = parseInt(selectedDateRange.value);
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
}

const responseTimeClass = computed(() => {
  const time = analytics.value.responseTime;
  if (time < 1) return 'excellent';
  if (time < 3) return 'good';
  return 'needs-improvement';
});

const responseTimeStatus = computed(() => {
  const time = analytics.value.responseTime;
  if (time < 1) return 'Excellent response time!';
  if (time < 3) return 'Good response time';
  return 'Needs improvement';
});

async function fetchAnalyticsData() {
  loading.value = true;
  
  try {
    // In a real app, replace with actual API calls:
    // const response = await fetch(`/api/analytics?days=${selectedDateRange.value}`);
    // const data = await response.json();
    
    // Mock data based on date range
    const days = parseInt(selectedDateRange.value);
    const mockData = generateMockData(days);
    
    analytics.value = mockData.analytics;
    bookingsData.value = mockData.bookings;
    revenueData.value = mockData.revenue;
    reviewsData.value = mockData.reviews;
    servicesData.value = mockData.services;
    
    // Update derived values
    totalBookings.value = mockData.bookings.reduce((sum, day) => sum + day.bookings, 0);
    completedBookings.value = Math.floor(totalBookings.value * 0.85);
    pendingBookings.value = totalBookings.value - completedBookings.value;
    totalRevenue.value = mockData.revenue.reduce((sum, day) => sum + day.amount, 0);
    averageRating.value = mockData.reviews.reduce((sum, day) => sum + day.rating, 0) / mockData.reviews.length;
    totalReviews.value = mockData.reviews.length;
    
    // Find most popular service
    const serviceCounts = {};
    mockData.services.forEach(service => {
      serviceCounts[service.name] = (serviceCounts[service.name] || 0) + service.bookings;
    });
    const [topService, topCount] = Object.entries(serviceCounts).reduce((a, b) => 
      a[1] > b[1] ? a : b
    );
    mostPopularService.value = topService;
    topServiceBookings.value = topCount;
    
    // Conversion rate mock
    inquiries.value = Math.floor(totalBookings.value * 1.5);
    conversionRate.value = Math.round((totalBookings.value / inquiries.value) * 100);
    
    // Revenue change calculation
    if (days > 7) {
      const currentPeriod = mockData.revenue.slice(-7).reduce((sum, day) => sum + day.amount, 0);
      const previousPeriod = mockData.revenue.slice(-14, -7).reduce((sum, day) => sum + day.amount, 0);
      revenueChange.value = previousPeriod > 0 ? 
        Math.round(((currentPeriod - previousPeriod) / previousPeriod) * 100) : 100;
    }
    
    animateSatisfaction(mockData.analytics.satisfaction);
    
    // Render charts
    renderCharts();
    
  } catch (error) {
    console.error("Failed to load analytics:", error);
    // Fallback data
    analytics.value = {
      topService: "N/A",
      satisfaction: 0,
      responseTime: 0,
    };
  } finally {
    loading.value = false;
  }
}

function generateMockData(days) {
  const services = [
    "Electrical Maintenance",
    "Plumbing",
    "HVAC",
    "Carpentry",
    "Landscaping",
    "Cleaning",
    "Painting"
  ];
  
  const data = {
    bookings: [],
    revenue: [],
    reviews: [],
    services: [],
    analytics: {
      topService: services[Math.floor(Math.random() * services.length)],
      satisfaction: 85 + Math.floor(Math.random() * 15),
      responseTime: 1 + Math.random() * 3
    }
  };
  
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    // Bookings data
    const bookings = Math.floor(5 + Math.random() * 15 * (i > days / 2 ? 1.2 : 1));
    data.bookings.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      bookings,
      completed: Math.floor(bookings * 0.85),
      pending: bookings - Math.floor(bookings * 0.85)
    });
    
    // Revenue data
    data.revenue.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      amount: Math.floor(bookings * (80 + Math.random() * 120))
    });
    
    // Reviews data (only some days have reviews)
    if (Math.random() > 0.3) {
      data.reviews.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        rating: 3 + Math.random() * 2,
        count: Math.floor(1 + Math.random() * 5)
      });
    }
  }
  
  // Services data
  services.forEach(service => {
    data.services.push({
      name: service,
      bookings: Math.floor(10 + Math.random() * 40),
      revenue: Math.floor(1000 + Math.random() * 5000)
    });
  });
  
  return data;
}

function renderCharts() {
  // Destroy existing charts
  [bookingsChart, revenueChart, reviewsChart, servicesChart].forEach(chartRef => {
    if (chartRef.value?.chartInstance) {
      chartRef.value.chartInstance.destroy();
    }
  });
  
  // Bookings Chart
  if (bookingsChart.value) {
    const bookingsCtx = bookingsChart.value.getContext('2d');
    bookingsChart.value.chartInstance = new Chart(bookingsCtx, {
      type: 'bar',
      data: {
        labels: bookingsData.value.map(d => d.date),
        datasets: [
          {
            label: 'Completed',
            data: bookingsData.value.map(d => d.completed),
            backgroundColor: 'rgba(34, 197, 94, 0.7)',
            borderColor: 'rgb(34, 197, 94)',
            borderWidth: 1,
            borderRadius: 4
          },
          {
            label: 'Pending',
            data: bookingsData.value.map(d => d.pending),
            backgroundColor: 'rgba(251, 191, 36, 0.7)',
            borderColor: 'rgb(251, 191, 36)',
            borderWidth: 1,
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Bookings'
            }
          }
        }
      }
    });
  }
  
  // Revenue Chart
  if (revenueChart.value) {
    const revenueCtx = revenueChart.value.getContext('2d');
    revenueChart.value.chartInstance = new Chart(revenueCtx, {
      type: 'line',
      data: {
        labels: revenueData.value.map(d => d.date),
        datasets: [{
          label: 'Revenue ($)',
          data: revenueData.value.map(d => d.amount),
          borderColor: 'rgb(139, 92, 246)',
          backgroundColor: 'rgba(139, 92, 246, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Revenue ($)'
            }
          }
        }
      }
    });
  }
  
  // Reviews Chart
  if (reviewsChart.value) {
    const reviewsCtx = reviewsChart.value.getContext('2d');
    reviewsChart.value.chartInstance = new Chart(reviewsCtx, {
      type: 'radar',
      data: {
        labels: ['5 Stars', '4 Stars', '3 Stars', '2 Stars', '1 Star'],
        datasets: [{
          label: 'Rating Distribution',
          data: [35, 40, 15, 7, 3],
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 2,
          pointBackgroundColor: 'rgb(59, 130, 246)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            beginAtZero: true,
            max: 50,
            ticks: {
              stepSize: 10
            }
          }
        }
      }
    });
  }
  
  // Services Chart
  if (servicesChart.value) {
    const servicesCtx = servicesChart.value.getContext('2d');
    servicesChart.value.chartInstance = new Chart(servicesCtx, {
      type: 'doughnut',
      data: {
        labels: servicesData.value.map(d => d.name),
        datasets: [{
          data: servicesData.value.map(d => d.bookings),
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(139, 92, 246, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(14, 165, 233, 0.8)',
            'rgba(236, 72, 153, 0.8)'
          ],
          borderColor: [
            'rgb(59, 130, 246)',
            'rgb(16, 185, 129)',
            'rgb(245, 158, 11)',
            'rgb(139, 92, 246)',
            'rgb(239, 68, 68)',
            'rgb(14, 165, 233)',
            'rgb(236, 72, 153)'
          ],
          borderWidth: 2,
          hoverOffset: 15
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
          }
        }
      }
    });
  }
}

onMounted(() => {
  fetchAnalyticsData();
});

onBeforeUnmount(() => {
  // Clean up chart instances
  [bookingsChart, revenueChart, reviewsChart, servicesChart].forEach(chartRef => {
    if (chartRef.value?.chartInstance) {
      chartRef.value.chartInstance.destroy();
    }
  });
});
</script>

<style scoped>
.analytics-section {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
  color: #1e293b;
  font-family: "Poppins", sans-serif;
  animation: fadeIn 0.6s ease-out;
  position: relative;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.header {
  text-align: center;
  margin-bottom: 28px;
}

.title {
  font-size: 2.1rem;
  font-weight: 700;
  color: #1e40af;
  margin-bottom: 0.5rem;
  letter-spacing: -0.5px;
}

.subtitle {
  color: #64748b;
  font-size: 1.05rem;
  margin-bottom: 2rem;
  line-height: 1.5;
}

/* Date Range Selector */
.date-range-selector {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 12px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.date-range-selector select {
  padding: 8px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  color: #334155;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.date-range-selector select:hover {
  border-color: #3b82f6;
}

.date-range-display {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
  font-weight: 500;
}

.date-range-display i {
  color: #3b82f6;
}

/* Charts Grid */
.charts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 32px;
}

.chart-container {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
  transition: transform 0.3s ease;
}

.chart-container:hover {
  transform: translateY(-2px);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.chart-header h3 {
  font-size: 1.1rem;
  color: #334155;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.chart-header i {
  color: #3b82f6;
}

.chart-stats {
  display: flex;
  gap: 8px;
}

.stat-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  background: #f1f5f9;
}

.stat-badge.total { background: #dbeafe; color: #1d4ed8; }
.stat-badge.completed { background: #d1fae5; color: #065f46; }
.stat-badge.pending { background: #fef3c7; color: #92400e; }
.stat-badge.revenue { background: #ede9fe; color: #5b21b6; }
.stat-badge.positive { background: #d1fae5; color: #065f46; }
.stat-badge.negative { background: #fee2e2; color: #991b1b; }
.stat-badge.average { background: #fef3c7; color: #92400e; }
.stat-badge.popular { background: #e0e7ff; color: #3730a3; }

.chart-wrapper {
  height: 300px;
  position: relative;
}

/* Analytics Cards Grid */
.analytics-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
  margin-top: 32px;
}

.analytic-card {
  background: white;
  border-radius: 20px;
  padding: 28px 20px;
  text-align: center;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28);
  position: relative;
  overflow: hidden;
  border: 1px solid #f1f5f9;
}

.analytic-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
}

.analytic-card h3 {
  font-size: 1.15rem;
  color: #334155;
  margin: 16px 0 12px;
  font-weight: 600;
}

.analytic-card p {
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: 0.5px;
  color: #0f172a;
  margin: 0;
  line-height: 1.2;
}

.card-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  font-size: 1.4rem;
}

.card-subtext {
  margin-top: 8px;
  font-size: 0.9rem;
  color: #64748b;
}

.card-subtext.excellent { color: #10b981; }
.card-subtext.good { color: #f59e0b; }
.card-subtext.needs-improvement { color: #ef4444; }

.rating-stars {
  margin-top: 8px;
  font-size: 0.9rem;
}

.rating-stars .fa-star {
  color: #e2e8f0;
}

.rating-stars .fa-star.filled {
  color: #fbbf24;
}

.top-service::before { background: #3b82f6; }
.top-service .card-icon {
  background: rgba(59, 130, 246, 0.12);
  color: #3b82f6;
}

.satisfaction::before { background: #10b981; }
.satisfaction .card-icon {
  background: rgba(16, 185, 129, 0.12);
  color: #10b981;
}

.response-time::before { background: #f59e0b; }
.response-time .card-icon {
  background: rgba(245, 158, 11, 0.12);
  color: #f59e0b;
}

.conversion::before { background: #8b5cf6; }
.conversion .card-icon {
  background: rgba(139, 92, 246, 0.12);
  color: #8b5cf6;
}

.analytic-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
  border-color: #e2e8f0;
}

/* Loading Overlay */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
  border-radius: 16px;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e2e8f0;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ===== RESPONSIVE DESIGN ===== */
@media (max-width: 1200px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .analytics-section {
    padding: 20px;
  }

  .title {
    font-size: 1.9rem;
  }

  .chart-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .chart-stats {
    flex-wrap: wrap;
  }

  .chart-wrapper {
    height: 250px;
  }

  .analytics-cards {
    gap: 20px;
  }

  .analytic-card {
    padding: 24px 16px;
  }

  .analytic-card p {
    font-size: 1.8rem;
  }
}

@media (max-width: 480px) {
  .analytics-section {
    padding: 16px;
  }

  .header {
    margin-bottom: 24px;
  }

  .title {
    font-size: 1.7rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .date-range-selector {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .analytics-cards {
    grid-template-columns: 1fr;
    gap: 18px;
  }

  .analytic-card {
    padding: 26px 18px;
  }

  .analytic-card p {
    font-size: 2.2rem;
  }

  .card-icon {
    width: 56px;
    height: 56px;
    font-size: 1.3rem;
  }
}
</style>